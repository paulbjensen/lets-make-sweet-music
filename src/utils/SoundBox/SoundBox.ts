/*
    This class is used to manage loading sounds and playing them.
*/

export class SoundBox {
  audioContext: AudioContext;
  soundBuffers: Record<string, AudioBuffer>;
  keyToFile: Record<string, string>;
  source: AudioBufferSourceNode | null = null;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;

  constructor(initialKeyToFile: Record<string, string>) {
    this.audioContext = new AudioContext();
    this.soundBuffers = {};
    this.keyToFile = initialKeyToFile;

    // Setup analyser
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
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
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = buffer;
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.source.start();
    }
  }
}