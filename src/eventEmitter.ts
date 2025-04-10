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

const eventEmitter = new EventEmitter();

export default eventEmitter;
