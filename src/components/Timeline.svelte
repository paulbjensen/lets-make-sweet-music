<script lang="ts">
import { onDestroy, onMount } from "svelte";
const { tracks, eventEmitter, pressKey, releaseKey } = $props();
import Track from "./Track.svelte";

const initialMarkerPosition = 75;
let markerPosition = $state(initialMarkerPosition);
let interval: number | undefined;
const maxMarkerPosition: number = 680;

function moveMarker() {
	interval = setInterval(() => {
		markerPosition = Math.min(maxMarkerPosition, markerPosition + 1);
	}, 10);
}

function moveMarkerToStart() {
	clearInterval(interval);
	markerPosition = initialMarkerPosition;
}

onMount(() => {
	eventEmitter.on(["playTracks", "playTrack"], moveMarker);
	eventEmitter.on(
		["finishPlayingTracks", "finishPlayingTrack"],
		moveMarkerToStart,
	);
});

onDestroy(() => {
	eventEmitter.off(["playTracks", "playTrack"], moveMarker);
	eventEmitter.off(
		["finishPlayingTracks", "finishPlayingTrack"],
		moveMarkerToStart,
	);
});

const axisPoints = new Array(14).fill(0);
</script>

<style>

    #timeline {
        border: dashed 1px rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        width: 800px;
        height: 200px;
        position: relative;
        display: grid;
    }

    #marker {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 0px;
        left: var(--left, 0);
        width: 10px;
    }

    #marker-head {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 10px solid white;
        border-radius: 2px;
    }

    #marker-tail {
        width: 1px;
        height: 190px;
        background-color: white;
        margin-top: -2px;
    }

    #tracks {
        margin-top: 30px;
        display: grid;
        grid-gap: 5px;
        align-items: flex-start;
    }

    #axis {
        position: absolute;
        top: 0;
        left: 80px;
        width: calc(100% - 80px);
        height: 20px;
        border-bottom: 1px solid white;
        display: grid;
        grid-template-columns: repeat(14, 50px);
    }

    #axis > .axis-point {
        position: relative;
        width: 1px;
        height: 10px;
        top: 10px;
        background-color: white;
    }

</style>

{#if tracks.length === 0}
    <div class="no-tracks">
        No tracks Recorded yet
    </div>
{:else}
    <div id="timeline">
        <div id="marker" draggable="true" style:--left={`${markerPosition}px`}>
            <div id="marker-head"></div>
            <div id="marker-tail"></div>
        </div>

        <div id="axis">
            {#each axisPoints as point}
                <div class="axis-point"></div>
            {/each}
        </div>
        <div id="tracks">
            {#each tracks as track}
                <Track {track} number={tracks.indexOf(track) + 1} {eventEmitter} {pressKey} {releaseKey} />        
            {/each}
        </div>
    </div>
{/if}
