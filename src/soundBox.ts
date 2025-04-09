import { SoundBox } from "./utils/SoundBox/SoundBox";

/*
    This is used as a way to load sounds and play them

    For now the sounds are linked to keyboard shortcuts,
    but in the future this will be configurable, so that 
    new sounds can be added, as well as linking the sounds
    to different keys on the keyboard.
*/

// Here are the sounds that will be played when the keys are pressed
import soundOne from "./assets/keyboard/1.mp3";
import soundTwo from "./assets/keyboard/2.mp3";
import soundThree from "./assets/keyboard/3.mp3";
import soundFour from "./assets/keyboard/4.mp3";
import soundFive from "./assets/keyboard/5.mp3";
import soundSix from "./assets/keyboard/6.mp3";
import soundSeven from "./assets/keyboard/7.mp3";
import soundEight from "./assets/keyboard/8.mp3";

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

const soundBox = new SoundBox(keyToFile);
export { soundBox };
