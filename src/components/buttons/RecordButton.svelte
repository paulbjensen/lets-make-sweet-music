<script lang="ts">
import recordIcon from "../../assets/icons/record.svg";
import stopIcon from "../../assets/icons/stop.svg";

let recording = $state(false);
const { startRecording, stopRecording, enabled } = $props();

const toggleRecording = () => {
	if (recording) {
		stopRecording?.();
		recording = false;
	} else {
		startRecording?.();
		recording = true;
	}
};
</script>

<style>
    .record-button {
        background: none;
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .record-button > img {
        pointer-events: none;
    }

    .record-button:disabled {
        cursor: not-allowed;
        opacity: 0.1;
    }
</style>

<button class="record-button" onclick={toggleRecording} disabled={!enabled}>
  {#if recording}
    <img src={stopIcon} alt="Stop" width="24" height="24" />
  {:else}
    <img src={recordIcon} alt="Record" width="24" height="24" />
  {/if}
</button>
