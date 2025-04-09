/*
    This is the Oscillator class used to support visualising the sound output 
    in the Oscilloscope component.
*/

export interface OscillatorProps {
    audioContext: AudioContext;
    fftSize?: number;
}

export class Oscillator {

  analyser?: AnalyserNode;
  dataArray?: Uint8Array;
  bufferLength?: number;

  constructor({audioContext, fftSize}: OscillatorProps) {
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = fftSize || 2048;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
  }      
}