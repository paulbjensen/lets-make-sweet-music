<script lang="ts">
import { onDestroy, onMount } from "svelte";
import type { Note } from "../types";
import type Recording from "../utils/Recording/Recording";
import PlaybackButton from "./buttons/PlaybackButton.svelte";
import RemoveButton from "./buttons/RemoveButton.svelte";

const { track, number, eventEmitter, pressKey, releaseKey } = $props();

let currentTrack: Recording | null = $state(null);
let isPlaying = $state(false);
const enablePlayback = $state(true);

function calculateClipLength(track: Recording) {
	if (!track.startedAt || !track.endedAt) {
		return "100px";
	}
	const clipLength = (track.endedAt - track.startedAt) / 10; // Convert to milliseconds
	return `${clipLength}px`;
}

onMount(() => {});

onDestroy(() => {});

function calculateNoteLeft(note: Note) {
	const left = note.pressedAt / 10;
	return `${left}px`;
}

function calculateNoteWidth(note: Note) {
	$inspect(note);
	if (!note.releasedAt || !note.pressedAt) {
		return "2px";
	}
	const width = (note.releasedAt - note.pressedAt) / 10;
	return `${width}px`;
}

function playWithTrack(track: Recording) {
	return () => {
		currentTrack = track;
		return play();
	};
}

function play() {
	if (!currentTrack) {
		console.error("No track selected");
		return;
	}
	isPlaying = true;
	for (const event of currentTrack.events) {
		const delay = event.timestamp;
		setTimeout(() => {
			if (event.type === "pressKey") {
				pressKey(event.key);
			} else if (event.type === "releaseKey") {
				releaseKey(event.key);
			}
			if (event === currentTrack?.events[currentTrack?.events.length - 1]) {
				isPlaying = false;
			}
		}, delay);
	}
}
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
        <RemoveButton onclick={() => eventEmitter.emit("removeTrack", track)} />
    </div>
</div>