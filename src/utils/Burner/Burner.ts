class Burner {
	burnToCD: MediaStreamAudioDestinationNode;
	cd?: MediaRecorder;
	isBurning: boolean;

	constructor(audioContext: AudioContext) {
		this.burnToCD = audioContext.createMediaStreamDestination();
		this.isBurning = false;
	}

	connectSource(source: AudioNode) {
		if (this.cd && this.isBurning) {
			source.connect(this.burnToCD);
		}
	}

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

export default Burner;
