<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import logo from './assets/logo.svg'
  import Keyboard from './Keyboard.svelte';
  import { loadSounds, playSound } from './soundBox';

  let pressedKeys: string[] = [];

  function pressKey (key: string) {
    if (!pressedKeys.includes(key)) {
      pressedKeys = [...pressedKeys, key];
    }
    playSound(key);
  }

  function releaseKey (key: string) {
    pressedKeys = pressedKeys.filter(k => k !== key);
  }

  function handleKeyPress (event:KeyboardEvent) {
    const pressedKey = event.key;
    pressKey(pressedKey);
  }

  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('keyup', (event) => {
    releaseKey(event.key);
  });

  onMount(loadSounds);

  onDestroy(() => {
    window.removeEventListener('keypress', handleKeyPress);
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