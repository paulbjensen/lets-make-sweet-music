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
	"playTracks",
	"playSound",
	"playTrack",
	"finishPlayingTrack",
	"removeTrack",
	"pressKey",
	"releaseKey",
	"finishPlayingTracks",
	"startRecording",
	"stopRecording",
	"startBurning",
];

const eventEmitter = new EventEmitter({ typedEvents });

// Set this flag to true to enable logging
// eventEmitter.enableLogging = true;

export default eventEmitter;
