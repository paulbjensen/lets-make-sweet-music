<script lang="ts">
// Make sure to check out the notes in MidiSynth copy.svelte for comments
// that explain the code in more detail
import { onMount } from "svelte";
import {
	describeVelocity,
	getNoteName,
	parseStatusByte,
} from "../utils/MidiRecorder/midiDecoder";

const { eventEmitter } = $props();

let midiStatus = $state("Waiting for MIDI...");
const midiLogs: string[] = $state([]);

onMount(async () => {
	// Used for scrolling the MIDI logs container
	// to the bottom when new logs are added
	const midiLogsContainer: HTMLDivElement | null =
		document.querySelector(".midi-logs");
	if (midiLogsContainer) {
		const observer = new MutationObserver(() => {
			midiLogsContainer.scrollTop = midiLogsContainer.scrollHeight;
		});

		observer.observe(midiLogsContainer, { childList: true });
		// return () => observer.disconnect();
	}

	if (!navigator.requestMIDIAccess) {
		midiStatus = "Web MIDI API not supported";
		return;
	}

	try {
		const midiAccess = await navigator.requestMIDIAccess();
		const inputs = [...midiAccess.inputs.values()];

		const isAvailable = (input: MIDIInput) => input.state === "connected";

		const availableInputs = inputs.filter(isAvailable);

		if (availableInputs.length === 0) {
			midiStatus = "No MIDI devices available";
			return;
		}

		midiStatus = "MIDI device connected ✅";

		const input = availableInputs[0];
		midiStatus = `MIDI device connected: ${input.name} (${input.manufacturer})`;

		input.onmidimessage = (event: MIDIMessageEvent) => {
			if (event.data) {
				const [status, note, velocity] = event.data;
				midiLogs.push(event.data.join(","));
				const { command, channel } = parseStatusByte(status);
				const noteName = getNoteName(note);
				const velocityLabel = describeVelocity(velocity);

				const logItem = `${command} ${noteName} on channel ${channel} at velocity ${velocity} (${velocityLabel})`;
				midiLogs.push(logItem);

				const parsedCommand = status & 0xf0;

				if (parsedCommand === 0x90 && velocity > 0) {
					eventEmitter.emit("playNote", note, velocity);
				} else if (
					parsedCommand === 0x80 ||
					(parsedCommand === 0x90 && velocity === 0)
				) {
					eventEmitter.emit("stopNote", note);
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

<h3>🎹 Smooth Synth (ADSR + Filter + Reverb)</h3>
<div class="synth-status">{midiStatus}</div>
<div class="midi-logs">
	{#each midiLogs as log}
		<div>{log}</div>
	{/each}
</div>