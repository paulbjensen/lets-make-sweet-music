export class SoundBox {
	audioContext: AudioContext;
	soundBuffers: Record<string, AudioBuffer>;
	keyToFile: Record<string, string>;
	source: AudioBufferSourceNode | null = null;
	analyser?: AnalyserNode;
	burnToCD: MediaStreamAudioDestinationNode;
	cd?: MediaRecorder;
	isBurning: boolean;

	constructor(initialKeyToFile: Record<string, string>) {
		this.audioContext = new AudioContext();
		this.soundBuffers = {};
		this.keyToFile = initialKeyToFile;

		// This could be extracted to a separate thing - a burner class
		this.burnToCD = this.audioContext.createMediaStreamDestination();
		this.isBurning = false;
	}

	playSound(key: string) {
		const buffer = this.soundBuffers[key];
		if (buffer) {
			this.source = this.audioContext.createBufferSource();
			this.source.buffer = buffer;
			// This is where you can link up the analyser to the source
			if (this.analyser) {
				this.source.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			} else {
				// If the analyser is not set up, just connect to the destination
				this.source.connect(this.audioContext.destination);
			}

			// This bit might be key too
			if (this.cd && this.isBurning) {
				this.source.connect(this.burnToCD);
			}

			this.source.start();
		}
	}

	/*
		Can't believe this worked. Amazing!

		I think that potentially one optimization would be to see if we can 
		swap in the OfflineAudioContext to then burn and save the file,
		without needing to do playback on the client. That would be very nice.

	*/
	// This bit too
	startBurning() {
		this.isBurning = true;
		this.cd = new MediaRecorder(this.burnToCD.stream);
		const chunks: BlobPart[] = [];

		this.cd.ondataavailable = (e) => {
			chunks.push(e.data);
		};

		this.cd.onstop = () => {
			const blob = new Blob(chunks, { type: "audio/ogg" });
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = "recording.ogg";
			a.click();
		};

		// Start recording
		this.cd.start();
	}

	stopBurning() {
		this.cd?.stop();
		this.isBurning = false;
	}
}
