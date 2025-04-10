<script lang="ts">
const { enablePlayback, isPlaying, onclick } = $props();
import playIcon from "../assets/icons/play.svg";
</script>

<style>
  .playback {
    background: linear-gradient(180deg, rgb(22, 171, 16) 0%, rgb(32, 231, 25) 100%);
    border: none;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5), inset 0px 0px 4px rgba(255, 255, 255, 0.5);
  }

  .playback > img {
    pointer-events: none;
  }

  .playback:disabled {
    background: linear-gradient(180deg, rgb(86, 86, 86) 0%, rgb(118, 118, 118) 100%);
    cursor: not-allowed;
  }
</style>

<button class="playback" disabled={!enablePlayback || isPlaying} {onclick}>
  {#if isPlaying}
    ...
  {:else}
    <img src={playIcon} alt="Play" width="32" height="32" />
  {/if}
</button>