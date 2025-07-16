import type { EventMap } from "@anephenix/event-emitter";
import EventEmitter from "@anephenix/event-emitter";

type LMSMEventMap = EventMap & {
	playTracks: (tracks: string[]) => void; // Used to play all tracks in the player (effectively the song)
	playSound: (sound: string) => void; // Plays an individual sound on the soundbox
	playTrack: (track: string) => void; // Used to play an individual track
	finishPlayingTrack: (track: string) => void; // Used to signal that a track has finished playing
	removeTrack: (track: string) => void; // When a track is removed from the list of tracks
	pressKey: (key: string) => void; // When a key is pressed on the keyboard instrument
	releaseKey: (key: string) => void; // When a key is released on the keyboard instrument
	finishPlayingTracks: () => void; // When all tracks have finished playing
	startRecording: () => void; // When the user starts recording a track
	stopRecording: () => void; // When the user stops recording a track
	startBurning: () => void; // When the user starts burning a track (to save to disk)
	playNote: (note: string) => void; // When a note is played on the keyboard instrument
	stopNote: (note: string) => void; // When a note is stopped on the keyboard instrument
	updateADSR: (adsr: {
		attack: number;
		decay: number;
		sustain: number;
		release: number;
	}) => void; // When the user updates the ADSR settings on the synthesizer
	updateFilterAndOscillator: (filter: string, oscillator: string) => void; // When the user updates the filter and oscillator settings on the synthesizer,
	updateADSRFromKeyboard: (adsr: {
		attack: number;
		decay: number;
		sustain: number;
		release: number;
	}) => void; // This will update the ADSR settings from a MIDI-connected keyboard
};

const eventEmitter = new EventEmitter<LMSMEventMap>();

// Set this flag to true to enable logging
// eventEmitter.enableLogging = true;

export default eventEmitter;
