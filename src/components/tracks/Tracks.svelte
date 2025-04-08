<script lang="ts">
    import type Recording from "../../utils/Recording/Recording";
    import PlaybackButton from "../PlaybackButton.svelte";
    import removeIcon from '../../assets/icons/remove.svg';


  const { tracks, pressKey, releaseKey, removeTrack } = $props();

  let currentTrack:Recording|null = $state(null);
  let isPlaying = $state(false);
  let enablePlayback = $state(true);

  function playWithTrack(track:Recording) {
    return () => {
        currentTrack = track;
        return play();
    }
  }

  function play() {
    if (!currentTrack) {
      console.error('No track selected');
      return;
    }
    isPlaying = true;
    currentTrack.events.forEach(event => {
      const delay = event.timestamp;
      setTimeout(() => {
        if (event.type === 'pressKey') {
          pressKey(event.key);
        } else if (event.type === 'releaseKey') {
          releaseKey(event.key);
        }
        if (event === currentTrack?.events[currentTrack?.events.length - 1]) {
          isPlaying = false;
        }
      }, delay);
    });
  }

</script>

<style>
    #tracks {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-top: 10px;
    }

    .track {
        width: 500px;
        min-height: 50px;
        border: solid 1px rgba(255, 255, 255, 0.5);
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    }

     .remove-button {
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

    .remove-button > img {
        pointer-events: none;
    }

    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
</style>

<div id="tracks">
    {#each tracks as track}
        <div class="track">
            <div class="track-name">Track {tracks.indexOf(track) + 1}</div>
            <div class="note-presses">
                {track.events.length / 2} Notes
            </div>
            <div class="buttons">
                <PlaybackButton isPlaying={isPlaying && track === currentTrack} play={playWithTrack(track)} {enablePlayback} />
                <button class="remove-button" onclick={() => removeTrack(track)}>
                    <img src={removeIcon} alt="Remove Track" width="24" height="24" />
                </button>                 
            </div>
        </div>
    {/each}
</div>