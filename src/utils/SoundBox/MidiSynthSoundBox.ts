class MidiSynthSoundBox {
	audioContext: AudioContext;
	activeVoices: Record<number, { osc: OscillatorNode; gain: GainNode }>;
	roomWavFile?: string;
	reverb: ConvolverNode;
	analyser?: AnalyserNode;
	burnToCD: MediaStreamAudioDestinationNode;
	cd?: MediaRecorder;
	isBurning: boolean;

	constructor({ roomWavFile }: { roomWavFile?: string }) {
		this.audioContext = new AudioContext();
		this.activeVoices = {};
		this.roomWavFile = roomWavFile;
		this.reverb = this.audioContext.createConvolver();
		// This could be extracted to a separate thing - a burner class
		this.burnToCD = this.audioContext.createMediaStreamDestination();
		this.isBurning = false;

		if (this.roomWavFile) this.load();
	}

	load() {
		(async () => {
			if (this.roomWavFile) {
				const response = await fetch(this.roomWavFile);
				const arrayBuffer = await response.arrayBuffer();
				const audioBuffer =
					await this.audioContext.decodeAudioData(arrayBuffer);
				this.reverb.buffer = audioBuffer;
			}
		})();
	}

	/*
        Converts a MIDI note number to frequency in Hz.
        The formula is based on the equal temperament tuning system.
        A4 (MIDI note 69) is set to 440 Hz.
        Reference: https://en.wikipedia.org/wiki/MIDI#Note_numbers
    */
	midiToFreq(note: number): number {
		return 440 * 2 ** ((note - 69) / 12);
	}

	playNote(note: number, velocity: number) {
		const now = this.audioContext.currentTime;

		const osc = this.audioContext.createOscillator();
		const gain = this.audioContext.createGain();
		const filter = this.audioContext.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 1500;

		// ADSR envelope
		const attack = 0.05;
		const decay = 0.1;
		const sustain = 0.6;

		osc.type = "triangle";
		osc.frequency.value = this.midiToFreq(note);

		gain.gain.setValueAtTime(0, now);
		gain.gain.linearRampToValueAtTime(velocity / 127, now + attack);
		gain.gain.linearRampToValueAtTime(
			sustain * (velocity / 127),
			now + attack + decay,
		);

		osc.connect(gain);
		gain.connect(filter);
		if (this.roomWavFile) {
			filter.connect(this.reverb);

			if (this.analyser) {
				this.reverb.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			} else {
				this.reverb.connect(this.audioContext.destination);
			}
		} else {
			if (this.analyser) {
				filter.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			} else {
				filter.connect(this.audioContext.destination);
			}
		}

		// This bit might be key too
		if (this.cd && this.isBurning) {
			const source = this.analyser || this.reverb || filter;
			source.connect(this.burnToCD);
		}

		osc.start();

		this.activeVoices[note] = { osc, gain };
	}

	stopNote(note: number) {
		const voice = this.activeVoices[note];
		if (voice) {
			const now = this.audioContext.currentTime;
			const release = 0.2;
			voice.gain.gain.cancelScheduledValues(now);
			voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
			voice.gain.gain.linearRampToValueAtTime(0, now + release);
			voice.osc.stop(now + release);
			delete this.activeVoices[note];
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

	stopBurning() {
		this.cd?.stop();
		this.isBurning = false;
	}
}

export default MidiSynthSoundBox;
