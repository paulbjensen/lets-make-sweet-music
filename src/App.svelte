<script lang="ts">
// Dependencies
import { onMount } from "svelte";
import type { Key } from "./types";

// UI Components
import Keyboard from "./components/instruments/keyboard/Keyboard.svelte";
import NavigationBar from "./components/navigation-bar/NavigationBar.svelte";
import Tracks from "./components/tracks/Tracks.svelte";
// import Timeline from './components/Timeline.svelte';

import { keyboardSoundBox } from "./components/instruments/keyboard/keyboardSoundBox";
// Utils
import Recording from "./utils/Recording/Recording";
import { Oscillator } from "./utils/analysers/Oscillator";

// Here we connect the soundBox to the Oscillator
const oscillator = new Oscillator({
	audioContext: keyboardSoundBox.audioContext,
	fftSize: 2048,
});
keyboardSoundBox.analyser = oscillator.analyser;

/* This is used to store tracks */
let tracks: Recording[] = $state([]);

// This keeps a track of the keys that are currently pressed
let pressedKeys: string[] = $state([]);

const recording = new Recording();

let enablePlayback = $state(false);
let isPlaying = $state(false);

/* 
    This is a list of keys that are available on the keyboard.
    The keys are divided into two types: upper and lower.
    The lower keys are the ones that are used for the white keys.
    The upper keys (the ones in black) are yet to be implemented.

    At some point I want to make this a configurable property so that
    the user can choose:

    - What keys are available, in what layout
    - What keyboard shortcuts they are mapped to

    // This feels like it belongs to an instrument instance,
    // in a sequence of instruments.
  */
const keys: Key[] = [
	{ type: "lower", id: 1, note: "C3", shortcut: "a" },
	{ type: "lower", id: 2, note: "D3", shortcut: "s" },
	{ type: "lower", id: 3, note: "E3", shortcut: "d" },
	{ type: "lower", id: 4, note: "F3", shortcut: "f" },
	{ type: "lower", id: 5, note: "G3", shortcut: "g" },
	{ type: "lower", id: 6, note: "A3", shortcut: "h" },
	{ type: "lower", id: 7, note: "B3", shortcut: "j" },
	{ type: "lower", id: 8, note: "C4", shortcut: "k" },
	// { type: 'lower', id: 8, note: 'D4', shortcut: 'l' },
	{ type: "upper", id: 9, note: "C#3", shortcut: "w" },
	{ type: "upper", id: 10, note: "D#3", shortcut: "e" },
	{ type: "upper", id: 11, note: "F#3", shortcut: "t" },
	{ type: "upper", id: 12, note: "G#3", shortcut: "y" },
	{ type: "upper", id: 12, note: "A#3", shortcut: "o" },
];

/*
    This function is called when a key is pressed
    It adds the key to the pressedKeys array and plays the sound
    associated with the key.
  */
function pressKey(key: string) {
	if (!pressedKeys.includes(key)) {
		pressedKeys = [...pressedKeys, key];
	}
	recording.addEvent({ type: "pressKey", key });
	keyboardSoundBox.playSound(key);
}

/*
    This function is called when a key is released
    It removes the key from the pressedKeys array.
  */
function releaseKey(key: string) {
	recording.addEvent({ type: "releaseKey", key });
	pressedKeys = pressedKeys.filter((k) => k !== key);
}

/* When the component mounts, we want to load the sounds for playback */
onMount(async () => {
	await keyboardSoundBox.loadSounds();
});

// Starts the recording
function startRecording() {
	recording.start();
	enablePlayback = false;
}

/* This saves the recording to the tracks list */
function saveRecordingToTracks() {
	const clone = new Recording();
	clone.events = [...recording.events];
	clone.startedAt = recording.startedAt;
	clone.endedAt = recording.endedAt;
	tracks.push(clone);
}

// Stops the recording
function stopRecording() {
	recording.stop();
	if (recording.events.length > 0) {
		saveRecordingToTracks();
		enablePlayback = true;
	}
}

// This plays the recording
function play() {
	isPlaying = true;
	const hasFinished = new Array(tracks.length).fill(false);
	for (const track of tracks) {
		for (const event of track.events) {
			const delay = event.timestamp;
			setTimeout(() => {
				if (event.type === "pressKey") {
					pressKey(event.key);
				} else if (event.type === "releaseKey") {
					releaseKey(event.key);
				}
				if (event === track.events[track.events.length - 1]) {
					hasFinished[tracks.indexOf(track)] = true;
					if (hasFinished.every((finished) => finished)) {
						isPlaying = false;
					}
				}
			}, delay);
		}
	}
}

function removeTrack(track: Recording) {
	tracks = tracks.filter((t) => t !== track);
}
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
</style>

<NavigationBar
  {startRecording}
  {stopRecording}
  {isPlaying}
  {play}
  {enablePlayback}
  analyser={keyboardSoundBox.analyser}
  dataArray={oscillator.dataArray}
  bufferLength={oscillator.bufferLength}
/>
<main>
  <Tracks tracks={tracks} {pressKey} {releaseKey} {removeTrack} />
  <Keyboard keys={keys} {pressKey} {releaseKey} pressedKeys={pressedKeys} />
</main>