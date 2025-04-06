<script lang="ts">
  // Dependencies
  import { onMount, onDestroy } from 'svelte';

  // Components
  import Keyboard from './components/Keyboard.svelte';
  import Logo from './components/Logo.svelte';
	import RecordButton from './components/RecordButton.svelte';
  import PlaybackButton from './components/PlaybackButton.svelte';

  // Utils
  import Recording from './utils/Recording/Recording';
  import { soundBox } from './soundBox';

  // This keeps a track of the keys that are currently pressed
  let pressedKeys: string[] = [];

  const recording = new Recording();

  let enablePlayback = false;
  let isPlaying = false; 

  /*
    This function is called when a key is pressed
    It adds the key to the pressedKeys array and plays the sound
    associated with the key.
  */
  function pressKey (key: string) {
    if (!pressedKeys.includes(key)) {
      pressedKeys = [...pressedKeys, key];
    }
    recording.addEvent({ type: 'pressKey', key });
    // recording = recording; // 👈 trigger reactivity
    soundBox.playSound(key);
  }

  /*
    This function is called when a key is released
    It removes the key from the pressedKeys array.
  */
  function releaseKey (key: string) {
    recording.addEvent({ type: 'releaseKey', key });
    // recording = recording; // 👈 trigger reactivity
    pressedKeys = pressedKeys.filter(k => k !== key);
  }

  /*
    This function is called when a key on the computer keyboard is pressed.
  */
  function handleKeyPress (event:KeyboardEvent) {
    pressKey(event.key);
  }

  /*
    This function is called when a key on the computer keyboard is released.
  */
  function handleKeyUp (event:KeyboardEvent) {
    releaseKey(event.key);
  }

  /* bindings for keyboard actions */
  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('keyup', handleKeyUp);

  /* When the component mounts, we want to load the sounds for playback */
  onMount(async () => { await soundBox.loadSounds(); });

  /* When the component is destroyed, we want to remove the event listeners */
  onDestroy(() => {
    window.removeEventListener('keypress', handleKeyPress);
    window.removeEventListener('keyup', handleKeyUp);
  });


  // Actions for starting and stopping recording
  function startRecording() {
    recording.start();
    enablePlayback = false;
  }

  function stopRecording() {
    recording.stop();
    if (recording.events.length > 0) {
      enablePlayback = true;
    }
  }

  function play() {
    isPlaying = true;
    recording.events.forEach(event => {
      const delay = event.timestamp;
      setTimeout(() => {
        if (event.type === 'pressKey') {
          pressKey(event.key);
        } else if (event.type === 'releaseKey') {
          releaseKey(event.key);
        }
        if (event === recording.events[recording.events.length - 1]) {
          isPlaying = false;
        }
      }, delay);
    });
  }

</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    grid-row-gap: 20px;
  }
</style>

<main>
  <Logo />
  <Keyboard {pressKey} {releaseKey} pressedKeys={pressedKeys} />
  <div class="record-and-playback-buttons">
    <RecordButton {startRecording} {stopRecording} />
    <PlaybackButton {isPlaying} {play} {enablePlayback} />
  </div>
</main>