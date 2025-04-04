/*
    This class is used to manage loading sounds and playing them.
*/

export class SoundBox {
  audioContext: AudioContext;
  soundBuffers: Record<string, AudioBuffer>;
  keyToFile: Record<string, string>;

  constructor(initialKeyToFile: Record<string, string>) {
    this.audioContext = new AudioContext();
    this.soundBuffers = {};
    this.keyToFile = initialKeyToFile;
  }

  async loadSounds () {
    const entries = Object.entries(this.keyToFile);
    await Promise.all(entries.map(async ([key, src]) => {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.soundBuffers[key] = audioBuffer;
    }));
  }

  playSound (key: string) {
    const buffer = this.soundBuffers[key];
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
    }
  }
}