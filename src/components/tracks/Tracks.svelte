<script lang="ts">
import type Recording from "../../utils/Recording/Recording";
import PlaybackButton from "../PlaybackButton.svelte";
import RemoveButton from "../RemoveButton.svelte";

const { tracks, pressKey, releaseKey, eventEmitter } = $props();

let currentTrack: Recording | null = $state(null);
let isPlaying = $state(false);
const enablePlayback = $state(true);

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
    #tracks {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-top: 10px;
    }

    .track {
        width: 500px;
        min-height: 50px;
        border: solid 1px rgba(255, 255, 255, 0.5);
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    }



    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
</style>

<div id="tracks">
    {#each tracks as track}
        <div class="track">
            <div class="track-name">Track {tracks.indexOf(track) + 1}</div>
            <div class="note-presses">
                {track.events.length / 2} Notes
            </div>
            <div class="buttons">
                <PlaybackButton isPlaying={isPlaying && track === currentTrack} onclick={playWithTrack(track)} {enablePlayback} />
                <RemoveButton onclick={() => eventEmitter.emit("removeTrack", track)} />
            </div>
        </div>
    {/each}
</div>