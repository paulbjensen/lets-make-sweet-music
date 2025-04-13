/*
    This class is used to manage loading sounds and playing them.

    I think that a few changes worth making are:

    - We need a way to trigger an event when the sounds are loaded, so that the UI can display
      a loading status indicator in the UI.
    - We also need a way to handle sounds that might not load (networking issues, missing file etc)
      - Retry, disable the sound on the instrument, or something else?
    - We also need a way relate this to instruments, as sounds may be specific to an instrument
*/

/*
	Adding this as a way to attempt a retry on a fetch request.
*/
export async function fetchWithRetry(
	url: string,
	retries = 3,
	delay = 10,
): Promise<Response> {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
			return res;
		} catch (e) {
			if (attempt === retries) throw e;
			await new Promise((r) => setTimeout(r, delay));
		}
	}
	throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

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
				const response = await fetchWithRetry(src);
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

		I think that potentially one optimization would be to see if we can 
		swap in the OfflineAudioContext to then burn and save the file,
		without needing to do playback on the client. That would be very nice.

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
