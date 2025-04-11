<script lang="ts">
import { onDestroy, onMount } from "svelte";

// The time as a string
let time = $state("00:00:000");
let startTime = $state(0);
let interval: number | undefined;

const { eventEmitter } = $props();

function start() {
	startTime = Date.now();
	interval = setInterval(() => {
		const now = Date.now();
		const elapsed = now - startTime;
		const minutes = Math.floor((elapsed / 1000 / 60) % 60);
		const seconds = Math.floor((elapsed / 1000) % 60);
		const milliseconds = Math.floor(elapsed % 1000);
		time = `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
	}, 10);
}

function stop() {
	clearInterval(interval);
}

function reset() {
	clearInterval(interval);
	time = "00:00:000";
}

// Let's bind the start and stop functions to the event emitter
onMount(() => {
	eventEmitter.on("startRecording", start);
	eventEmitter.on("playTracks", start);
	eventEmitter.on("stopRecording", stop);
	eventEmitter.on("finishPlayingTracks", reset);
});

// When the component is destroyed, we want to remove the event listeners
onDestroy(() => {
	stop(); // Just in case it is running for some reason
	eventEmitter.off("startRecording", start);
	eventEmitter.off("playTracks", start);
	eventEmitter.off("stopRecording", stop);
	eventEmitter.off("finishPlayingTracks", reset);
});
</script>

<style>
    #timer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 50px;
        background-color: #262626;
        border-radius: 4px;
    }

    .current-time {
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        font-size: 24px;
        color: white;
    }
</style>

<div id="timer">
    <div class="current-time">
        {time}
    </div>
</div>