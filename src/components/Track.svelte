<script lang="ts">
// Dependencies
import { onDestroy, onMount } from "svelte";
import type { Note } from "../types";
import type Recording from "../utils/Recording/Recording";
import PlaybackButton from "./buttons/PlaybackButton.svelte";
import RemoveButton from "./buttons/RemoveButton.svelte";

// Props
const { track, number, eventEmitter, pressKey, releaseKey } = $props();

// States
let currentTrack: Recording | null = $state(null);
let isPlaying = $state(false);
let enablePlayback = $state(true);

/*
    This function calculates the length of the clip based on the
    startedAt and endedAt properties of the track. If either of them
    is not set, it returns a default value of 100px.
*/
function calculateClipLength(track: Recording) {
	if (!track.startedAt || !track.endedAt) {
		return "100px";
	}
	const clipLength = (track.endedAt - track.startedAt) / 10; // Convert to milliseconds
	return `${clipLength}px`;
}

/*
    This function calculates the left position of the note based on
    the pressedAt property of the note. It returns a string with the
    value in pixels.
*/
function calculateNoteLeft(note: Note) {
	const left = note.pressedAt / 10;
	return `${left}px`;
}

/*
    This function calculates the width of the note based on the
    releasedAt and pressedAt properties of the note. If either of them
    is not set, it returns a default value of 2px.
*/
function calculateNoteWidth(note: Note) {
	if (!note.releasedAt || !note.pressedAt) {
		return "2px";
	}
	const width = (note.releasedAt - note.pressedAt) / 10;
	return `${width}px`;
}

/*
    This will play a single track, which is good to reviewing the track in 
    isolation from the other tracks that make up the song.
*/
function playWithTrack(track: Recording) {
	return () => {
		currentTrack = track;
		return play();
	};
}

/*
    This plays the track.

    I think that this needs to emit some events to the event emitter to signal 
    when it has started playing, and when it has finished playing, so that:

    - The timer can start
    - The marker can move along
    - We can disable buttons that we don't want to be pressed while the track is playing, like remove or record or download or play all tracks

    - emit event "playTrack" when starting
    - emit event "finishPlayingTrack" when finished

    Step one - see that this works fine
    Step two - add listeners in the track to disable the buttons when 
*/
function play() {
	if (!currentTrack) {
		console.error("No track selected");
		return;
	}
	eventEmitter.emit("playTrack", currentTrack);
	isPlaying = true;
	const duration =
		currentTrack.endedAt && currentTrack.startedAt
			? currentTrack.endedAt - currentTrack.startedAt
			: currentTrack.events[currentTrack.events.length - 1].timestamp;
	setTimeout(() => {
		eventEmitter.emit("finishPlayingTrack", currentTrack);
		isPlaying = false;
	}, duration);
	for (const event of currentTrack.events) {
		const delay = event.timestamp;
		setTimeout(() => {
			if (event.type === "pressKey") {
				pressKey(event.key);
			} else if (event.type === "releaseKey") {
				releaseKey(event.key);
			}
		}, delay);
	}
}

/*
    If any track is playing, we want to disable the playback button on other 
    tracks, so that users can't trigger a bug of trying to play two tracks 
    at the same time.
*/
function lockPlayback() {
	enablePlayback = false;
}

function unlockPlayback() {
	enablePlayback = true;
}

onMount(() => {
	eventEmitter.on("playTrack", lockPlayback);
	eventEmitter.on("finishPlayingTrack", unlockPlayback);
});

onDestroy(() => {
	eventEmitter.off("playTrack", lockPlayback);
	eventEmitter.off("finishPlayingTrack", unlockPlayback);
});
</script>

<style>
    .track {
        display: grid;
        grid-template-columns: 60px 1fr 90px;
        grid-gap: 20px;
        align-items: center;
    }

    .track-clip {
        width: var(--width, 100px);
        height: 30px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: solid 1px rgba(255, 255, 255, 0.5);
        position: relative;
    }

    .note {
        background-color: rgba(0, 76, 207, 0.5);
        height: 10px;
        border-radius: 2px;
        position: absolute;
        width: var(--clip-width, 2px);
        left: var(--clip-left, 0);
    }

    .track-options {
        display: flex;
        grid-gap: 5px;
    }

    .track-clips {
        overflow-x: scroll;
        overflow-y: hidden;
    }

    .track-clips-content {
        display: flex;
        width: fit-content;
        height: 100%;
    }
</style>

<div class="track">
    <div class="track-name">Track {number}</div>
    <div class="track-clips">
        <div class="track-clips-content">
            <div class="track-clip" style:--width={calculateClipLength(track)}>
                {#each track.notesPlayed() as note}
                    <div class="note"
                        style:--clip-left={calculateNoteLeft(note)}
                        style:--clip-width={calculateNoteWidth(note)}
                    ></div>
                {/each}
            </div>
        </div>
    </div>
    <div class="track-options">
        <PlaybackButton isPlaying={isPlaying && track === currentTrack} onclick={playWithTrack(track)} {enablePlayback} />
        <RemoveButton onclick={() => eventEmitter.emit("removeTrack", track)} disabled={isPlaying} />
    </div>
</div>