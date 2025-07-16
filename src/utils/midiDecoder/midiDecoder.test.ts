import { describe, expect, it } from "vitest";
import {
	describeVelocity,
	getNoteName,
	getNoteNumber,
	parseStatusByte,
} from "./midiDecoder";

describe("midiDecoder", () => {
	describe("#parseStatusByte", () => {
		it("should parse a status byte into command type and channel number", () => {
			const byte = 0x90; // Note On message on channel 1
			const result = parseStatusByte(byte);
			expect(result.command).toBe("noteon");
			expect(result.channel).toBe(1);
		});
	});

	describe("#getNoteName", () => {
		it("should return the correct note name for a given note number", () => {
			expect(getNoteName(60)).toBe("C4");
			expect(getNoteName(61)).toBe("C#4");
			expect(getNoteName(72)).toBe("C5");
			expect(getNoteName(48)).toBe("C3");
		});
	});

	describe("#getNoteNumber", () => {
		it("should return the correct note number for a given note name", () => {
			expect(getNoteNumber("C4")).toBe(60);
			expect(getNoteNumber("C#4")).toBe(61);
			expect(getNoteNumber("B3")).toBe(59);
			expect(getNoteNumber("C5")).toBe(72);
		});

		it("should throw an error for invalid note names", () => {
			expect(() => getNoteNumber("H4")).toThrow("Invalid note name: H4");
		});
	});

	describe("#describeVelocity", () => {
		it('should return "silent" for velocity 0', () => {
			expect(describeVelocity(0)).toBe("silent");
		});

		it('should return "soft" for velocities less than 40', () => {
			expect(describeVelocity(20)).toBe("soft");
		});

		it('should return "medium" for velocities between 40 and 90', () => {
			expect(describeVelocity(50)).toBe("medium");
		});

		it('should return "hard" for velocities 90 and above', () => {
			expect(describeVelocity(100)).toBe("hard");
		});
	});
});
