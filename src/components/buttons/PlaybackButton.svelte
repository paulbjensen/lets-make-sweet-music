<script lang="ts">
const { enablePlayback, isPlaying, onclick } = $props();
import playIcon from "../../assets/icons/play.svg";
</script>

<style>
  .playback {
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

  .playback > img {
    width: 24px;
    height: 24px;
    pointer-events: none;
  }

  .playback:disabled {
    opacity: 0.1;
  }
</style>

<button class="playback" disabled={!enablePlayback || isPlaying} {onclick}>
    <img src={playIcon} alt="Play" width="24" height="24" />
</button>