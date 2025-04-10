<script lang="ts">
// Dependencies
import { onDestroy, onMount } from "svelte";
import type { Key } from "./types";

// UI Components
import Keyboard from "./components/instruments/keyboard/Keyboard.svelte";
import NavigationBar from "./components/navigation-bar/NavigationBar.svelte";
import Tracks from "./components/tracks/Tracks.svelte";
// import Timeline from './components/Timeline.svelte';

// Utils
import { keyboardSoundBox } from "./components/instruments/keyboard/keyboardSoundBox";
import eventEmitter from "./eventEmitter";
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

// This is the recording object that will be used to store the events
// when recording
const recording = new Recording();

function pressKey(key: string) {
	recording.addEvent({ type: "pressKey", key });
	keyboardSoundBox.playSound(key);
}

/*
    This function is called when a key is released
*/
function releaseKey(key: string) {
	recording.addEvent({ type: "releaseKey", key });
}

// Removes a track from the tracks list
function removeTrack(track: Recording) {
	tracks = tracks.filter((t) => t !== track);
}

// This plays the recording
function play() {
  if (tracks.length === 0) {
    console.log("No tracks to play");
    eventEmitter.emit("finishPlayingTracks");
    /* 
      TODO - when there are no tracks left, we should set 
      enablePlayback in the navigation bar component 
      to false.
    */
  }
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
						eventEmitter.emit("finishPlayingTracks");
					}
				}
			}, delay);
		}
	}
}

/* This saves the recording to the tracks list */
function saveRecordingToTracks() {
	const clone = new Recording();
	clone.events = [...recording.events];
	clone.startedAt = recording.startedAt;
	clone.endedAt = recording.endedAt;
	tracks.push(clone);
}

// Starts the recording
function startRecording() {
	recording.start();
}

// Stops the recording
function stopRecording() {
	recording.stop();
	if (recording.events.length > 0) {
		saveRecordingToTracks();
	}
}

/* When the component mounts, we want to load the sounds for playback */
onMount(async () => {
	await keyboardSoundBox.loadSounds();
	eventEmitter.on("removeTrack", (track) => removeTrack(track as Recording));
	eventEmitter.on("playTracks", play);
	eventEmitter.on("startRecording", startRecording);
	eventEmitter.on("stopRecording", stopRecording);
  eventEmitter.on("pressKey", (key) => pressKey(key as string));
  eventEmitter.on("releaseKey", (key) => releaseKey(key as string));
});

onDestroy(() => {
	eventEmitter.off("removeTrack", (track) => removeTrack(track as Recording));
	eventEmitter.off("playTracks", play);
	eventEmitter.off("startRecording", startRecording);
	eventEmitter.off("stopRecording", stopRecording);
  eventEmitter.off("pressKey", (key) => pressKey(key as string));
  eventEmitter.off("releaseKey", (key) => releaseKey(key as string));
});
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
  analyser={keyboardSoundBox.analyser}
  dataArray={oscillator.dataArray}
  bufferLength={oscillator.bufferLength}
  {eventEmitter}
/>
<main>
  <Tracks tracks={tracks} {pressKey} {releaseKey} {eventEmitter} />
  <Keyboard {eventEmitter} />
</main>