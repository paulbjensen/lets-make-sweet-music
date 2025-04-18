import { SoundBox } from "../../utils/SoundBox/SoundBox";

// This ought to be moved to another location, so that we can have instruments that change up the sounds in the

/*
    This is used as a way to load sounds and play them

    For now the sounds are linked to keyboard shortcuts,
    but in the future this will be configurable, so that 
    new sounds can be added, as well as linking the sounds
    to different keys on the keyboard.
*/

// Here are the sounds that will be played when the keys are pressed
import soundOne from "./sounds/1.mp3";
import soundTwo from "./sounds/2.mp3";
import soundThree from "./sounds/3.mp3";
import soundFour from "./sounds/4.mp3";
import soundFive from "./sounds/5.mp3";
import soundSix from "./sounds/6.mp3";
import soundSeven from "./sounds/7.mp3";
import soundEight from "./sounds/8.mp3";

// Keys are linked to keyboard shortcuts
// I feel like this bit could be extracted out as configuration,
// as well as imports for the sounds - this way, the soundBox can be loaded
const keyToFile: Record<string, string> = {
	C3: soundOne,
	D3: soundTwo,
	E3: soundThree,
	F3: soundFour,
	G3: soundFive,
	A3: soundSix,
	B3: soundSeven,
	C4: soundEight,
	D4: soundEight,
	"C#3": soundEight,
	"D#3": soundEight,
	"F#3": soundEight,
	"G#3": soundEight,
	"A#3": soundEight,
};

const waaSoundBox = new SoundBox(keyToFile);
export { waaSoundBox };
