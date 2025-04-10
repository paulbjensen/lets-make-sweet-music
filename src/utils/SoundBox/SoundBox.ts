/*
    This class is used to manage loading sounds and playing them.

    I think that a few changes worth making are:

    - We need a way to trigger an event when the sounds are loaded, so that the UI can display
      a loading status indicator in the UI.
    - We also need a way to handle sounds that might not load (networking issues, missing file etc)
      - Retry, disable the sound on the instrument, or something else?
    - We also need a way relate this to instruments, as sounds may be specific to an instrument
*/

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
		this.burnToCD = this.audioContext.createMediaStreamDestination();
		this.isBurning = false;
	}

	async loadSounds() {
		const entries = Object.entries(this.keyToFile);
		await Promise.all(
			entries.map(async ([key, src]) => {
				const response = await fetch(src);
				const arrayBuffer = await response.arrayBuffer();
				const audioBuffer =
					await this.audioContext.decodeAudioData(arrayBuffer);
				this.soundBuffers[key] = audioBuffer;
			}),
		);
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
			if (this.cd && this.isBurning) {
				this.source.connect(this.burnToCD);
			}
			this.source.start();
		}
	}

	/*
		Can't believe this worked. Amazing!

		Now, the trick is to make it work seamlessly, so that you can burn the 
		music file with one click and have it automatically stop recording when
		it is finished.

		I think that this could be achieved through coordinating some events to 
		trigger the start of recording, then playing the tracks, then when the 
		track has finished playing, wait a few seconds then stop the recording.

		For now I want to save the code at this commit stage, then I will do 
		the tweaks afterwards.
	*/
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
