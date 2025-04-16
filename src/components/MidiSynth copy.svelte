<script lang="ts">
// Dependencies
import { onMount } from "svelte";

// The text for the MIDI status
let midiStatus: string = $state("Waiting for MIDI...");
const midiLogs: string[] = $state([]);

// The audio context
const audioCtx = new AudioContext();

// A store for active oscillators
const activeOscillators: Record<number, OscillatorNode> = {};

/*
	Converts a MIDI note number to frequency in Hz.
	The formula is based on the equal temperament tuning system.
	A4 (MIDI note 69) is set to 440 Hz.
	Reference: https://en.wikipedia.org/wiki/MIDI#Note_numbers
*/
function midiToFreq(note: number): number {
	return 440 * 2 ** ((note - 69) / 12);
}

/*
	Plays a note using the Web Audio API.
	Creates an oscillator and a gain node to control the volume.
	The note is played at the specified velocity (0-127).
*/
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

/*
	Stops playing a note by stopping the oscillator.
	If the note is not currently playing, it does nothing.
*/
function stopNote(note: number) {
	const osc = activeOscillators[note];
	if (osc) {
		osc.stop();
		delete activeOscillators[note];
	}
}
/*
	Mounts the component and sets up the MIDI access.
*/
onMount(async () => {
	// Check if the Web MIDI API is supported
	// If not, set the status to indicate that
	// the API is not supported
	if (!navigator.requestMIDIAccess) {
		midiStatus = "Web MIDI API not supported";
		return;
	}

	// Makes a request to the browser to access MIDI inputs
	try {
		const midiAccess = await navigator.requestMIDIAccess();
		const inputs = [...midiAccess.inputs.values()];

		if (inputs.length === 0) {
			midiStatus = "No MIDI devices found";
			return;
		}

		midiStatus = "MIDI device connected ✅";

		// Selects the first MIDI input device
		const input = inputs[0];

		// Sets up the MIDI input event listener to react on any MIDI messages
		// that are received from the MIDI device
		input.onmidimessage = (event: MIDIMessageEvent) => {
			if (event.data) {
				// MIDI messages are in the form of [status, note, velocity]
				// The status byte contains the command and channel
				// The note byte contains the note number
				// The velocity byte contains the velocity (0-127)
				midiLogs.push(event.data.join(", "));

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
		// If there is an error accessing the MIDI devices, set the status
		// to indicate that the access failed and display the error message
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

  .midi-logs {
	background: #222;
	color: #fff;
	font-family: monospace;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	margin: 1rem 0;
	max-height: 200px;
	overflow-y: auto;
  }
</style>

<h3>🎹 MIDI Synth (Sine Wave)</h3>
<div class="midi-status">{midiStatus}</div>
<div class="midi-logs">
	{#each midiLogs as log}
		<div>{JSON.stringify(log)}</div>
	{/each}
</div>
<!-- <button onclick={playNote.bind(null, 60, 127)}>Play Middle C</button>
<button onclick={stopNote.bind(null, 60)}>Stop Middle C</button>
<button onclick={playNote.bind(null, 62, 127)}>Play D</button>
<button onclick={stopNote.bind(null, 62)}>Stop D</button>
<button onclick={playNote.bind(null, 64, 127)}>Play E</button>
<button onclick={stopNote.bind(null, 64)}>Stop E</button>
<button onclick={playNote.bind(null, 65, 127)}>Play F</button>
<button onclick={stopNote.bind(null, 65)}>Stop F</button> -->