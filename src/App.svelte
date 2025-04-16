<script lang="ts">
// Dependencies
import { onDestroy, onMount } from "svelte";

// UI Components
import Timeline from "./components/Timeline.svelte";
import Keyboard from "./components/instruments/keyboard/Keyboard.svelte";
import NavigationBar from "./components/navigation-bar/NavigationBar.svelte";
import eventEmitter from "./eventEmitter";
// Utils
import { waaSoundBox } from "./soundBoxes/waaSoundbox/waaSoundBox";
import Player from "./utils/Player/Player";
import Recording from "./utils/Recording/Recording";
import { Oscillator } from "./utils/analysers/Oscillator";

// Here we connect the soundBox to the Oscillator
const oscillator = new Oscillator({
	audioContext: waaSoundBox.audioContext,
	fftSize: 2048,
});
waaSoundBox.analyser = oscillator.analyser;

// States
let tracks: Recording[] = $state([]);

// Configuration

// This is the recording object that will be used to store the events
// when recording
const recording = new Recording();

// Actions

function pressKey(key: string) {
	recording.addEvent({ type: "pressKey", key });
	waaSoundBox.playSound(key);
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

function play() {
	/*
		This is loading the tracks each time - I maye find a way to set it up 
		once and ensure the tracks list is kept up to date.
	*/
	new Player({ tracks, eventEmitter }).playSong();
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

/*
	NOTE

	One of the things I've noticed when burning the tracks is that the length 
	of the track is shorter than the recording time on the tracks, as if it 
	is trimming empty space at the start and end of the tracks. 

	This is worth investigating, as it ends up producing a clipped version of 
	what is being displayed in the timeline, and as a musician you might want
	the song to have a bit of space at the start and end of the track.
*/
function startBurning() {
	waaSoundBox.startBurning();
	eventEmitter.emit("playTracks");
}

/*
	This will stop burning the track (burning is a reference to when you'd 
	burn tracks onto CDs back in the day).
*/
function stopBurning() {
	if (waaSoundBox.isBurning) {
		waaSoundBox.stopBurning();
	}
}

/* When the component mounts, we want to load the sounds for playback */
onMount(async () => {
	await waaSoundBox.loadSounds();
	eventEmitter.on("removeTrack", (track) => removeTrack(track as Recording));
	eventEmitter.on("playTracks", play);
	eventEmitter.on("startRecording", startRecording);
	eventEmitter.on("stopRecording", stopRecording);
	eventEmitter.on("pressKey", (key) => pressKey(key as string));
	eventEmitter.on("releaseKey", (key) => releaseKey(key as string));
	eventEmitter.on("startBurning", startBurning);
	eventEmitter.on("finishPlayingTracks", stopBurning);
});

onDestroy(() => {
	eventEmitter.off("removeTrack", (track) => removeTrack(track as Recording));
	eventEmitter.off("playTracks", play);
	eventEmitter.off("startRecording", startRecording);
	eventEmitter.off("stopRecording", stopRecording);
	eventEmitter.off("pressKey", (key) => pressKey(key as string));
	eventEmitter.off("releaseKey", (key) => releaseKey(key as string));
	eventEmitter.off("startBurning", startBurning);
	eventEmitter.off("finishPlayingTracks", stopBurning);
});
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 10px;
  }
</style>

<NavigationBar
  analyser={waaSoundBox.analyser}
  dataArray={oscillator.dataArray}
  bufferLength={oscillator.bufferLength}
  {eventEmitter}
  {tracks}
/>
<main>
  <Timeline {tracks} {eventEmitter} />
  <Keyboard {eventEmitter} />
</main>