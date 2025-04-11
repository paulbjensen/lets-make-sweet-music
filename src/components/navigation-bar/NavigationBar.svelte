<script lang="ts">
import { onDestroy, onMount } from "svelte";
/*
        This is the navigation bar component that will contain the following:

        A way to interact with the timeline
        A way to start recording
        A way to stop recording
        A way to play the recording
        A way to stop the playback
        A way to see the current position in the timeline (both seconds and bars/beats) 
    */

import Logo from "../Logo.svelte";
import Oscilloscope from "../Oscilloscope.svelte";
import RecordingSign from "../RecordingSign.svelte";
import Timer from "../Timer.svelte";
import DownloadButton from "../buttons/DownloadButton.svelte";
import PlaybackButton from "../buttons/PlaybackButton.svelte";
import RecordButton from "../buttons/RecordButton.svelte";

/*
    NOTE - This is a bit of horrible props drilling that I will get around to removing later,
*/
const { analyser, dataArray, bufferLength, eventEmitter, tracks } = $props();

let enablePlayback = $state(false);
let isPlaying = $state(false);
let recordingSignEnabled = $state(false);

function finishPlayingTracks() {
	isPlaying = false;
	enablePlayback = true;
}

function playTracks() {
	isPlaying = true;
	eventEmitter.emit("playTracks");
}

function startRecording() {
	eventEmitter.emit("startRecording");
	enablePlayback = false;
	recordingSignEnabled = true;
}

function stopRecording() {
	eventEmitter.emit("stopRecording");
	enablePlayback = true;
	recordingSignEnabled = false;
}

/*
    This will look at the number of tracks that are in the tracks array
    and if there are no tracks, it will disable the playback button.
*/
function checkIfPlayShouldBeEnabled() {
	// I think that this is executing faster than the event emitter updated
	// True - it is, a shame. Will keep this for now to remind me that
	// eventemitters are independent in execution order, or that to guarantee
	// an order of events, you may have to chain events together.
	setTimeout(() => {
		enablePlayback = tracks.length > 0;
	}, 10);
}

function startBurning() {
	eventEmitter.emit("startBurning");
}

function whenTrackIsPlayed() {
	isPlaying = true;
	enablePlayback = false;
}

onMount(() => {
	eventEmitter.on("playTrack", whenTrackIsPlayed);
	eventEmitter.on("finishPlayingTracks", finishPlayingTracks);
	eventEmitter.on("finishPlayingTrack", finishPlayingTracks);
	eventEmitter.on("removeTrack", checkIfPlayShouldBeEnabled);
});

onDestroy(() => {
	eventEmitter.off("playTrack", whenTrackIsPlayed);
	eventEmitter.off("finishPlayingTracks", finishPlayingTracks);
	eventEmitter.off("finishPlayingTrack", finishPlayingTracks);
	eventEmitter.off("removeTrack", checkIfPlayShouldBeEnabled);
});
</script>

<style>
    #navigation-bar {
        display: grid;
        grid-template-columns: auto auto auto;
        gap: 20px;
        background: #333;
        padding: 10px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
    }

    #navigation-bar > div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    #navigation-bar > div:first-child {
        justify-content: flex-start;
    }

    #navigation-bar > div:last-child {
        justify-content: flex-end;
    }
</style>

<div id="navigation-bar">
    <Logo width={145} height={44} />
    <div id="middle-section">
        <DownloadButton enabled={enablePlayback && !isPlaying} onclick={startBurning} />
        <PlaybackButton {isPlaying} onclick={playTracks} {enablePlayback} />
        <RecordButton {startRecording} {stopRecording} enabled={!isPlaying} />
        <Timer {eventEmitter} />
    </div>
    <div id="right-section">
        <RecordingSign enabled={recordingSignEnabled} />
        <Oscilloscope
            analyser={analyser}
            dataArray={dataArray}
            bufferLength={bufferLength}
        />
    </div>
</div>