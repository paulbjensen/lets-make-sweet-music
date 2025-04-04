/*
    This is used as a way to load sounds and play them

    For now the sounds are linked to keyboard shortcuts,
    but in the future this will be configurable, so that 
    new sounds can be added, as well as linking the sounds
    to different keys on the keyboard.
*/

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

export async function loadSounds() {
    const entries = Object.entries(keyToFile);
    await Promise.all(entries.map(async ([key, src]) => {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      soundBuffers[key] = audioBuffer;
    }));
}

export function playSound(key: string) {
    const buffer = soundBuffers[key];
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  }
