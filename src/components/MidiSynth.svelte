<script lang="ts">
// Make sure to check out the notes in MidiSynth copy.svelte for comments
// that explain the code in more detail
import { onMount } from "svelte";
import roomWavFile from "../assets/rooms/room.wav";
import {
	describeVelocity,
	getNoteName,
	parseStatusByte,
} from "../utils/MidiRecorder/midiDecoder";

const { eventEmitter } = $props();

let midiStatus = $state("Waiting for MIDI...");
const midiLogs: string[] = $state([]);

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

		if (inputs.length === 0) {
			midiStatus = "No MIDI devices found";
			return;
		}

		midiStatus = "MIDI device connected ✅";

		const input = inputs[0];
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
					// eventEmitter.emit('pressKey', noteName);
					playNote(note, velocity);
				} else if (
					parsedCommand === 0x80 ||
					(parsedCommand === 0x90 && velocity === 0)
				) {
					// eventEmitter.emit('releaseKey', noteName);
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