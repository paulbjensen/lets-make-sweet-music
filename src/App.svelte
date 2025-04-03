<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import logo from './assets/logo.png'
  import Keyboard from './Keyboard.svelte';

  let pressedKey: string | null = $state(null);

  // Here are the sounds that will be played when the keys are pressed
  import soundOne from './assets/keyboard/1.mp3';
  import soundTwo from './assets/keyboard/2.mp3';
  import soundThree from './assets/keyboard/3.mp3';
  import soundFour from './assets/keyboard/4.mp3';
  import soundFive from './assets/keyboard/5.mp3';
  import soundSix from './assets/keyboard/6.mp3';
  import soundSeven from './assets/keyboard/7.mp3';
  import soundEight from './assets/keyboard/8.mp3';

  // This links the sounds to the keyboard shortcuts
  const soundBox = [
    { id: 1,  shortcut: 'a', src: soundOne },
    { id: 2,  shortcut: 's', src: soundTwo },
    { id: 3,  shortcut: 'd', src: soundThree },
    { id: 4,  shortcut: 'f', src: soundFour },
    { id: 5,  shortcut: 'g', src: soundFive },
    { id: 6,  shortcut: 'h', src: soundSix },
    { id: 7,  shortcut: 'j', src: soundSeven },
    { id: 8,  shortcut: 'k', src: soundEight },
  ];

  let audioContext = new AudioContext();
  let soundBuffers: Record<string, AudioBuffer> = {};

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
    pressedKey = event.key;
    const sound = soundBox.find(sound => sound.shortcut === pressedKey);
    if (sound) {
      playSound(pressedKey);
    }
  }

  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('keyup', () => {
    pressedKey = null; // Reset pressedKey when key is released
  });

  onMount(() => {
    loadSounds();
  });

  onDestroy(() => {
    window.removeEventListener('keypress', handleKeyPress);
  });

</script>

<style>

  #logo {
    margin-bottom: 20px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
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
    <img src={logo} alt="Let's make... Sweet Music" />
  </div>
  <Keyboard {playSound} pressedKey={pressedKey} />
</main>