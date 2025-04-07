<script lang="ts">
    import recordIcon from '../assets/icons/record.svg';
    import stopIcon from '../assets/icons/stop.svg';

    let recording = $state(false);
    const { startRecording, stopRecording } = $props();

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
        background: linear-gradient(180deg, #E02020 0%, #ff2f2c 100%);
        border: none;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 4px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5), inset 0px 0px 4px rgba(255, 255, 255, 0.5);
    }

    .record-button > img {
        pointer-events: none;
    }

</style>

<button class="record-button" onclick={toggleRecording}>
  {#if recording}
    <img src={stopIcon} alt="Stop" width="24" height="24" />
  {:else}
    <img src={recordIcon} alt="Record" width="24" height="24" />
  {/if}
</button>
