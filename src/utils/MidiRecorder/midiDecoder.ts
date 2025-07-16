/*
    A collection of functions used to decode MIDI messages.
*/

/*
    This function takes a byte and returns an object with the command type and channel number.

    In MIDI there are 16 channels, and the command type is represented by the first 4 bits of the byte.
    The channel number is represented by the last 4 bits of the byte.
*/
function parseStatusByte(byte: number) {
	const commandType = byte & 0xf0;
	const channel = (byte & 0x0f) + 1;

	const commands: Record<number, string> = {
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0x80: "noteoff",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0x90: "noteon",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0xa0: "poly aftertouch",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0xb0: "control change",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0xc0: "program change",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0xd0: "channel aftertouch",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0xe0: "pitch bend",
		// biome-ignore lint/complexity/useSimpleNumberKeys: Using Hexadecimal for MIDI command types
		0xf0: "system",
	};

	return {
		command: commands[commandType] ?? "unknown",
		channel,
	};
}

/*
    The NOTE_NAMES array contains the names of the notes in the MIDI standard.
    The notes are represented as strings, with sharps represented by '#' and flats represented by 'b'.
*/
const NOTE_NAMES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
];

/*
    This function takes a note number and returns the name of the note.
    The note number is represented as an integer, with middle C being 60.
    The octave number is represented by the integer division of the note number by 12.
*/
function getNoteName(noteNumber: number): string {
	const note = NOTE_NAMES[noteNumber % 12];
	const octave = Math.floor(noteNumber / 12) - 1;
	return `${note}${octave}`;
}

function getNoteNumber(noteName: string): number {
	const note = noteName.slice(0, -1);
	const octave = Number.parseInt(noteName.slice(-1), 10);
	const noteIndex = NOTE_NAMES.indexOf(note);
	if (noteIndex === -1) {
		throw new Error(`Invalid note name: ${noteName}`);
	}
	return noteIndex + (octave + 1) * 12;
}

/*
    This function takes a velocity value and returns a string describing the velocity.
    The velocity is represented as an integer, with 0 being silent and 127 being the maximum velocity.
*/
function describeVelocity(v: number) {
	if (v === 0) return "silent";
	if (v < 40) return "soft";
	if (v < 90) return "medium";
	return "hard";
}

export {
	parseStatusByte,
	NOTE_NAMES,
	getNoteName,
	getNoteNumber,
	describeVelocity,
};
