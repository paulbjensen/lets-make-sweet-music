import EventEmitter from "./utils/EventEmitter/EventEmitter";

/*
    This is an instance of the EventEmitter class that is used to
    communicate between different parts of the application.

    It implements a way for one piece of code to emit an event, 
    and for other parts of code to then execute a function when 
    that event is emitted.

    e.g. 

    eventEmitter.on("playSound", (sound: string) => {
        // Play the sound
        audio.play(sound);
    });

    eventEmitter.emit("playSound", "sound.mp3");

    This helps to reduce the need to pass functions around as 
    props, and allows for a more decoupled architecture.
*/

/*
    This is used as a way of keeping track of the events we have defined in the
    application across the files.

    If we pass this to the EventEmitter class upon initialization, and then we 
    we try to call the emit, on, or off functions with an event that is not in 
    this list, it will throw an error.
    
    This is useful, as it will help us to catch typos and also keep a record 
    of the events we use in the application.
*/
const typedEvents = [
	"playTracks", // Used to play all tracks in the player (effectively the song)
	"playSound", // Plays an individual sound on the soundbox
	"playTrack", // Used to play an individual track
	"finishPlayingTrack", // Used to signal that a track has finished playing
	"removeTrack", // When a track is removed from the list of tracks
	"pressKey", // When a key is pressed on the keyboard instrument
	"releaseKey", // When a key is released on the keyboard instrument
	"finishPlayingTracks", // When all tracks have finished playing
	"startRecording", // When the user starts recording a track
	"stopRecording", // When the user stops recording a track
	"startBurning", // When the user starts burning a track (to save to disk)
	"playNote", // When a note is played on the keyboard instrument
	"stopNote", // When a note is stopped on the keyboard instrument
	"updateADSR", // When the user updates the ADSR settings on the synthesizer
];

const eventEmitter = new EventEmitter({ typedEvents });

// Set this flag to true to enable logging
// eventEmitter.enableLogging = true;

export default eventEmitter;
