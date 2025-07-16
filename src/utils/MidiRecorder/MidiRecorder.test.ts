import { describe, expect, it } from "vitest";
import MidiRecorder from "./MidiRecorder";

describe("MidiRecorder", () => {
	it("should initialize with an empty events array", () => {
		const recorder = new MidiRecorder();
		expect(recorder.events).toEqual([]);
	});

	it("should add a MIDI event", () => {
		const recorder = new MidiRecorder();
		const event = {
			timestamp: Date.now(),
			data: {
				status: 144,
				note: 60,
				velocity: 100,
			},
		};
		recorder.addEvent(event);
		expect(recorder.events.length).toBe(1);
		expect(recorder.events[0]).toEqual(event);
	});
});
