import EventEmitter from "../EventEmitter/EventEmitter";

class MidiSynthSoundBox {
	audioContext: AudioContext;
	activeVoices: Record<number, { osc: OscillatorNode; gain: GainNode }>;
	roomWavFile?: string;
	reverb: ConvolverNode;
	analyser?: AnalyserNode;
	filter?: BiquadFilterNode;
	eventEmitter: EventEmitter;

	constructor({ roomWavFile }: { roomWavFile?: string }) {
		this.audioContext = new AudioContext();
		this.activeVoices = {};
		this.roomWavFile = roomWavFile;
		this.reverb = this.audioContext.createConvolver();

		// If we have initialized with a room wav audio file, then we
		// call load to fetch the audio file and decode it
		if (this.roomWavFile) this.load();
		this.eventEmitter = new EventEmitter();
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

	getSource() {
		const source = this.analyser || this.reverb || this.filter;
		return source;
	}

	playNote(note: number, velocity: number) {
		const now = this.audioContext.currentTime;

		const osc = this.audioContext.createOscillator();
		const gain = this.audioContext.createGain();
		this.filter = this.audioContext.createBiquadFilter();
		this.filter.type = "lowpass";
		this.filter.frequency.value = 1500;

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
		gain.connect(this.filter);
		if (this.roomWavFile) {
			this.filter.connect(this.reverb);

			if (this.analyser) {
				this.reverb.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			} else {
				this.reverb.connect(this.audioContext.destination);
			}
		} else {
			if (this.analyser) {
				this.filter.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			} else {
				this.filter.connect(this.audioContext.destination);
			}
		}

		// This is used so that just before the oscillator starts, we can
		// do things like connect the burner to the audio context to record
		// the sounds for putting onto a file.
		this.eventEmitter.emit("start");

		// The moment we start the oscillator
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
}

export default MidiSynthSoundBox;
