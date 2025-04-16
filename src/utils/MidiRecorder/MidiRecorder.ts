/*
    This file is used to record MIDI events that occur in time. This is so that we can structure 
*/

type MidiData = {
	status: number;
	note: number;
	velocity: number;
};

type MidiEvent = {
	timestamp: number;
	data: MidiData;
};

class MidiRecorder {
	public events: MidiEvent[];

	constructor() {
		this.events = [];
	}

	addEvent(event: MidiEvent) {
		this.events.push(event);
	}
}

export default MidiRecorder;
export type { MidiEvent, MidiData };
