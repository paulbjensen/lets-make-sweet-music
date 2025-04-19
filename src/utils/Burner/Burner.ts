class MidiSynthSoundBox {
	burnToCD: MediaStreamAudioDestinationNode;
	cd?: MediaRecorder;
	isBurning: boolean;

	constructor(audioContext: AudioContext) {
		this.burnToCD = audioContext.createMediaStreamDestination();
		this.isBurning = false;
	}

	// We use this
	connectSource(source: AudioNode) {
		if (this.cd && this.isBurning) {
			source.connect(this.burnToCD);
		}
	}

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

	// This bit too
	stopBurning() {
		this.cd?.stop();
		this.isBurning = false;
	}
}

export default MidiSynthSoundBox;
