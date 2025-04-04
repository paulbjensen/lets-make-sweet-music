<script lang="ts">
  // Dependencies
  import { onMount, onDestroy } from 'svelte';
  import logo from './assets/logo.svg'
  import Keyboard from './Keyboard.svelte';
  import { soundBox } from './soundBox';

  // This keeps a track of the keys that are currently pressed
  let pressedKeys: string[] = [];

  /*
    This function is called when a key is pressed
    It adds the key to the pressedKeys array and plays the sound
    associated with the key.
  */
  function pressKey (key: string) {
    if (!pressedKeys.includes(key)) {
      pressedKeys = [...pressedKeys, key];
    }
    soundBox.playSound(key);
  }

  /*
    This function is called when a key is released
    It removes the key from the pressedKeys array.
  */
  function releaseKey (key: string) {
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
</script>

<style>
  #logo {
    margin-bottom: 20px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
    width: 363px;
    height: 109px;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>

<main>
  <div id="logo">
    <img src={logo} alt="Let's make Sweet Music" width="363" height="109" fetchpriority="high" />
  </div>
  <Keyboard {pressKey} {releaseKey} pressedKeys={pressedKeys} />
</main>