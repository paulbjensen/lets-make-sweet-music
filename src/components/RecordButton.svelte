<script lang="ts">
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
        background-color: rgb(255, 27, 27); /* Green */
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
    }
</style>

<button class="record-button" onclick={toggleRecording}>
    {recording ? 'Stop' : 'Record'}
</button>
