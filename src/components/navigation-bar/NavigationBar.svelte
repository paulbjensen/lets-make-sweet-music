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
import PlaybackButton from "../PlaybackButton.svelte";
import RecordButton from "../RecordButton.svelte";

/*
    NOTE - This is a bit of horrible props drilling that I will get around to removing later,
*/
const { analyser, dataArray, bufferLength, eventEmitter, tracks } = $props();

let enablePlayback = $state(false);
let isPlaying = $state(false);

function finishPlayingTracks() {
	isPlaying = false;
}

function playTracks() {
	isPlaying = true;
	eventEmitter.emit("playTracks");
}

function startRecording() {
	eventEmitter.emit("startRecording");
	enablePlayback = false;
}

function stopRecording() {
	eventEmitter.emit("stopRecording");
	enablePlayback = true;
}

/*
    This will look at the number of tracks that are in the tracks array
    and if there are no tracks, it will disable the playback button.
*/
function checkIfPlayShouldBeEnabled() {
	enablePlayback = tracks.length > 0;
}

onMount(() => {
	eventEmitter.on("finishPlayingTracks", finishPlayingTracks);
	eventEmitter.on("removeTrack", checkIfPlayShouldBeEnabled);
});

onDestroy(() => {
	eventEmitter.off("finishPlayingTracks", finishPlayingTracks);
	eventEmitter.off("removeTrack", checkIfPlayShouldBeEnabled);
});
</script>

<style>
    #navigation-bar {
        display: grid;
        grid-template-columns: 180px auto 360px;
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
    </div>
    <div id="right-section">
        <RecordButton {startRecording} {stopRecording} />
        <PlaybackButton {isPlaying} onclick={playTracks} {enablePlayback} />
        <Oscilloscope
            analyser={analyser}
            dataArray={dataArray}
            bufferLength={bufferLength}
        />
    </div>
</div>