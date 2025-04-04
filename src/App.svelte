<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import logo from './assets/logo.svg'
  import Keyboard from './Keyboard.svelte';

  let pressedKeys: string[] = [];

  // Here are the sounds that will be played when the keys are pressed
  import soundOne from './assets/keyboard/1.mp3';
  import soundTwo from './assets/keyboard/2.mp3';
  import soundThree from './assets/keyboard/3.mp3';
  import soundFour from './assets/keyboard/4.mp3';
  import soundFive from './assets/keyboard/5.mp3';
  import soundSix from './assets/keyboard/6.mp3';
  import soundSeven from './assets/keyboard/7.mp3';
  import soundEight from './assets/keyboard/8.mp3';

  let audioContext = new AudioContext();
  let soundBuffers: Record<string, AudioBuffer> = {};

  // Keys are linked to keyboard shortcuts
  const keyToFile: Record<string, string> = {
    a: soundOne,
    s: soundTwo,
    d: soundThree,
    f: soundFour,
    g: soundFive,
    h: soundSix,
    j: soundSeven,
    k: soundEight,
  };

  async function loadSounds() {
    const entries = Object.entries(keyToFile);
    await Promise.all(entries.map(async ([key, src]) => {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      soundBuffers[key] = audioBuffer;
    }));
  }

  function playSound(key: string) {
    const buffer = soundBuffers[key];
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  }

  function handleKeyPress (event:KeyboardEvent) {
    const pressedKey = event.key;
    if (!pressedKeys.includes(pressedKey)) {
      pressedKeys = [...pressedKeys, pressedKey];
    }
    playSound(pressedKey);
  }

  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('keyup', (event) => {
    pressedKeys = pressedKeys.filter(key => key !== event.key);
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
    <img src={logo} alt="Let's make Sweet Music" width="363" height="109" />
  </div>
  <Keyboard {playSound} pressedKeys={pressedKeys} />
</main>