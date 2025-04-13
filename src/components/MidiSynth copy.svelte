<script lang="ts">
import { onMount } from "svelte";

let midiStatus = "Waiting for MIDI...";

const audioCtx = new AudioContext();
const activeOscillators: Record<number, OscillatorNode> = {};

function midiToFreq(note: number): number {
	return 440 * 2 ** ((note - 69) / 12);
}

function playNote(note: number, velocity: number) {
	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();

	osc.type = "sine";
	osc.frequency.value = midiToFreq(note);
	gain.gain.value = velocity / 127;

	osc.connect(gain).connect(audioCtx.destination);
	osc.start();

	activeOscillators[note] = osc;
}

function stopNote(note: number) {
	const osc = activeOscillators[note];
	if (osc) {
		osc.stop();
		delete activeOscillators[note];
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
	} catch (e) {
		const errorMessage: string =
			e instanceof Error ? e.message : "Unknown error";
		midiStatus = `Failed to access MIDI: ${errorMessage}`;
	}
});
</script>

<style>
  .midi-status {
    background: #111;
    color: #0f0;
    font-family: monospace;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    margin: 1rem 0;
    display: inline-block;
  }
</style>

<h3>🎹 MIDI Synth (Sine Wave)</h3>
<div class="midi-status">{midiStatus}</div>
<button onclick={playNote.bind(null, 60, 127)}>Play Middle C</button>
<button onclick={stopNote.bind(null, 60)}>Stop Middle C</button>
<button onclick={playNote.bind(null, 62, 127)}>Play D</button>
<button onclick={stopNote.bind(null, 62)}>Stop D</button>
<button onclick={playNote.bind(null, 64, 127)}>Play E</button>
<button onclick={stopNote.bind(null, 64)}>Stop E</button>
<button onclick={playNote.bind(null, 65, 127)}>Play F</button>
<button onclick={stopNote.bind(null, 65)}>Stop F</button>