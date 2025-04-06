<script lang="ts">

    const { enablePlayback, play, isPlaying } = $props();        

</script>

<style>
  .playback {
    background-color: rgb(22, 171, 16); /* Green */
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

  .playback:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
</style>

<button class="playback" disabled={!enablePlayback || isPlaying} onclick={play}>
    {isPlaying ? 'Playing...' : 'Playback recording'}
</button>