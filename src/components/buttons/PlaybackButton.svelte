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
    pointer-events: none;
  }

  .playback:disabled {
    opacity: 0.1;
  }
</style>

<button class="playback" disabled={!enablePlayback || isPlaying} {onclick}>
    <img src={playIcon} alt="Play" width="32" height="32" />
</button>