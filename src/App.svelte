<script lang="ts">
// Dependencies
import { onDestroy, onMount } from "svelte";

import ADSRSettings from "./components/ADSRSettings.svelte";
import FilterAndOscillatorSettings from "./components/FilterAndOscillatorSettings.svelte";
// UI Components
import Timeline from "./components/Timeline.svelte";
import Keyboard from "./components/instruments/keyboard/Keyboard.svelte";
import NavigationBar from "./components/navigation-bar/NavigationBar.svelte";
import eventEmitter from "./eventEmitter";
import type { ADSR, FilterAndOscillator } from "./types";
import Burner from "./utils/Burner/Burner";
import { getNoteNumber } from "./utils/MidiRecorder/midiDecoder";
// Utils
import Player from "./utils/Player/Player";
import Recording from "./utils/Recording/Recording";
// import MidiSynth from "./components/MidiSynth.svelte";
import MidiSynthSoundBox from "./utils/SoundBox/MidiSynthSoundBox";
import { Oscillator } from "./utils/analysers/Oscillator";

// import roomWavFile from "./assets/rooms/room.wav";
const midiSynthSoundBox = new MidiSynthSoundBox({
	// roomWavFile,
});

const burner = new Burner(midiSynthSoundBox.audioContext);

// Here we connect the waa soundBox to the Oscillator
const oscillator = new Oscillator({
	audioContext: midiSynthSoundBox.audioContext,
	fftSize: 2048,
});
midiSynthSoundBox.analyser = oscillator.analyser;
// States

let tracks: Recording[] = $state([]);

// Configuration

// This is the recording object that will be used to store the events
// when recording
const recording = new Recording();

// Actions

function pressKey(key: string, velocity?: number) {
	recording.addEvent({ type: "pressKey", key, velocity });
	const noteNumber = getNoteNumber(key);
	midiSynthSoundBox.playNote(noteNumber, velocity || 0);
}

/*
    This function is called when a key is released
*/
function releaseKey(key: string) {
	recording.addEvent({ type: "releaseKey", key });
	const noteNumber = getNoteNumber(key);
	midiSynthSoundBox.stopNote(noteNumber);
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

function connectBurnerToSource() {
	burner.connectSource(midiSynthSoundBox.getSource());
}

function updateADSR(settings: ADSR) {
	midiSynthSoundBox.attack = settings.attack;
	midiSynthSoundBox.decay = settings.decay;
	midiSynthSoundBox.sustain = settings.sustain;
	midiSynthSoundBox.release = settings.release;
}

function updateFilterAndOscillator(settings: FilterAndOscillator) {
	midiSynthSoundBox.filterType = settings.filterType;
	midiSynthSoundBox.oscillatorType = settings.oscillatorType;
	midiSynthSoundBox.filterFrequency = settings.filterFrequency;
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
	midiSynthSoundBox.eventEmitter.on("start", connectBurnerToSource);
	burner.startBurning();
	eventEmitter.emit("playTracks");
}

/*
	This will stop burning the track (burning is a reference to when you'd 
	burn tracks onto CDs back in the day).
*/
function stopBurning() {
	if (burner.isBurning) {
		burner.stopBurning();
		midiSynthSoundBox.eventEmitter.off("start", connectBurnerToSource);
	}
}

function playNote(note: number, velocity: number) {
	midiSynthSoundBox.playNote(note, velocity);
}

function stopNote(note: number) {
	midiSynthSoundBox.stopNote(note);
}

/* When the component mounts, we want to load the sounds for playback */
onMount(async () => {
	eventEmitter.on("removeTrack", (track) => removeTrack(track as Recording));
	eventEmitter.on("playTracks", play);
	eventEmitter.on("startRecording", startRecording);
	eventEmitter.on("stopRecording", stopRecording);

	// These events relate to the keyboard on the computer
	eventEmitter.on("pressKey", (key, velocity) =>
		pressKey(key as string, velocity as number),
	);
	eventEmitter.on("releaseKey", (key) => releaseKey(key as string));

	eventEmitter.on("playNote", (note, velocity) =>
		playNote(note as number, velocity as number),
	);
	eventEmitter.on("stopNote", (note) => stopNote(note as number));

	eventEmitter.on("startBurning", startBurning);
	eventEmitter.on("finishPlayingTracks", stopBurning);

	eventEmitter.on("updateADSR", (settings) => updateADSR(settings as ADSR));
	eventEmitter.on("updateFilterAndOscillator", (settings) =>
		updateFilterAndOscillator(settings as FilterAndOscillator),
	);
});

onDestroy(() => {
	eventEmitter.off("removeTrack", (track) => removeTrack(track as Recording));
	eventEmitter.off("playTracks", play);
	eventEmitter.off("startRecording", startRecording);
	eventEmitter.off("stopRecording", stopRecording);

	// These events relate to the keyboard on the computer
	eventEmitter.off("pressKey", (key, velocity) =>
		pressKey(key as string, velocity as number),
	);
	eventEmitter.off("releaseKey", (key) => releaseKey(key as string));

	// We might want to create something here that supports the use of the music keyboard
	eventEmitter.off("playNote", (note, velocity) =>
		playNote(note as number, velocity as number),
	);
	eventEmitter.off("stopNote", (note) => stopNote(note as number));

	eventEmitter.off("startBurning", startBurning);
	eventEmitter.off("finishPlayingTracks", stopBurning);

	eventEmitter.off("updateADSR", (settings) => updateADSR(settings as ADSR));
	eventEmitter.off("updateFilterAndOscillator", (settings) =>
		updateFilterAndOscillator(settings as FilterAndOscillator),
	);
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
  analyser={midiSynthSoundBox.analyser}
  dataArray={oscillator.dataArray}
  bufferLength={oscillator.bufferLength}
  {eventEmitter}
  {tracks}
/>
<main>
  <Timeline {tracks} {eventEmitter} />
  <Keyboard {eventEmitter} />
  <ADSRSettings {eventEmitter} defaultSettings={
	{
	  attack: midiSynthSoundBox.attack,
	  decay: midiSynthSoundBox.decay,
	  sustain: midiSynthSoundBox.sustain,
	  release: midiSynthSoundBox.release,
	}
  } />
  <FilterAndOscillatorSettings {eventEmitter} defaultSettings={
	{
	  filterType: midiSynthSoundBox.filterType,
	  oscillatorType: midiSynthSoundBox.oscillatorType,
	  filterFrequency: midiSynthSoundBox.filterFrequency,
	}
  } />
</main>