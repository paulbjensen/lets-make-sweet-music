<script lang="ts">
    /*
        This is the navigation bar component that will contain the following:

        A way to interact with the timeline
        A way to start recording
        A way to stop recording
        A way to play the recording
        A way to stop the playback
        A way to see the current position in the timeline (both seconds and bars/beats) 
    */

   	import RecordButton from '../RecordButton.svelte';
    import PlaybackButton from '../PlaybackButton.svelte';
    import Oscilloscope from '../Oscilloscope.svelte';
	import Logo from '../Logo.svelte';

    /*
        NOTE - This is a bit of horrible props drilling that I will get around to removing later,
    */
    const {startRecording, stopRecording, isPlaying, play, enablePlayback, analyser, dataArray, bufferLength } = $props();

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
        <PlaybackButton {isPlaying} {play} {enablePlayback} />
        <Oscilloscope
            analyser={analyser}
            dataArray={dataArray}
            bufferLength={bufferLength}
            {isPlaying}
        />
    </div>
</div>