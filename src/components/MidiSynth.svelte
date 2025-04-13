<script lang="ts">
// Make sure to check out the notes in MidiSynth copy.svelte for comments
// that explain the code in more detail
import { onMount } from "svelte";
import roomWavFile from "../assets/rooms/room.wav";

let midiStatus = "Waiting for MIDI...";
const audioCtx = new AudioContext();
const activeVoices: Record<number, { osc: OscillatorNode; gain: GainNode }> =
	{};

// Optional: load a reverb impulse response
const reverb = audioCtx.createConvolver();

(async () => {
	const response = await fetch(roomWavFile);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
	reverb.buffer = audioBuffer;
})();

function midiToFreq(note: number): number {
	return 440 * 2 ** ((note - 69) / 12);
}

function playNote(note: number, velocity: number) {
	const now = audioCtx.currentTime;

	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	const filter = audioCtx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = 1500;

	// ADSR envelope
	const attack = 0.05;
	const decay = 0.1;
	const sustain = 0.6;

	osc.type = "triangle";
	osc.frequency.value = midiToFreq(note);

	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(velocity / 127, now + attack);
	gain.gain.linearRampToValueAtTime(
		sustain * (velocity / 127),
		now + attack + decay,
	);

	osc.connect(gain);
	gain.connect(filter);
	filter.connect(reverb);
	reverb.connect(audioCtx.destination);

	osc.start();

	activeVoices[note] = { osc, gain };
}

function stopNote(note: number) {
	const voice = activeVoices[note];
	if (voice) {
		const now = audioCtx.currentTime;
		const release = 0.2;
		voice.gain.gain.cancelScheduledValues(now);
		voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
		voice.gain.gain.linearRampToValueAtTime(0, now + release);
		voice.osc.stop(now + release);
		delete activeVoices[note];
	}
}

onMount(async () => {
	if (!navigator.requestMIDIAccess) {
		midiStatus = "Web MIDI API not supported";
		return;
	}

	try {
		const midiAccess = await navigator.requestMIDIAccess();
		const inputs = [...midiAccess.inputs.values()];

		if (inputs.length === 0) {
			midiStatus = "No MIDI devices found";
			return;
		}

		midiStatus = "MIDI device connected ✅";

		const input = inputs[0];
		input.onmidimessage = (event: MIDIMessageEvent) => {
			if (event.data) {
				const [status, note, velocity] = event.data;
				const command = status & 0xf0;

				if (command === 0x90 && velocity > 0) {
					playNote(note, velocity);
				} else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
					stopNote(note);
				}
			}
		};
	} catch (e: unknown) {
		const errorMessage: string =
			e instanceof Error ? e.message : "Unknown error";
		midiStatus = `Failed to access MIDI: ${errorMessage}`;
	}
});
</script>

<style>
  .synth-status {
    background: #111;
    color: #0f0;
    font-family: monospace;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    margin: 1rem 0;
    display: inline-block;
  }
</style>

<h3>🎹 Smooth Synth (ADSR + Filter + Reverb)</h3>
<div class="synth-status">{midiStatus}</div>
<div class="controls">
  <button on:click={() => playNote.bind(null, 60, 127)}>Play C4</button>
  <button on:click={() => stopNote.bind(null, 60)}>Stop C4</button>
  <button on:click={() => playNote(67, 127)}>Play B4</button>
  <button on:click={() => stopNote(67)}>Stop B4</button>
  <button on:click={() => playNote(72, 127)}>Play C5</button>
  <button on:click={() => stopNote(72)}>Stop C5</button>
  <button on:click={() => playNote(74, 127)}>Play D5</button>
  <button on:click={() => stopNote(74)}>Stop D5</button>
  <button on:click={() => playNote(76, 127)}>Play E5</button>
  <button on:click={() => stopNote(76)}>Stop E5</button>
  <button on:click={() => playNote(79, 127)}>Play G5</button>
  <button on:click={() => stopNote(79)}>Stop G5</button>
  <button on:click={() => playNote(81, 127)}>Play A5</button>
  <button on:click={() => stopNote(81)}>Stop A5</button>
  <button on:click={() => playNote(84, 127)}>Play B5</button>
  <button on:click={() => stopNote(84)}>Stop B5</button>
</div>    