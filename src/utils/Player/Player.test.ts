import EventEmitter from "@anephenix/event-emitter";
import { describe, expect, it } from "vitest";
import type Recording from "../Recording/Recording";
import Player from "./Player";

describe("Player", () => {
	describe("constructor", () => {
		it("should initialize with an event emitter, and optionally a list of tracks", () => {
			const tracks = [] as Recording[];
			const eventEmitter = new EventEmitter();
			const player = new Player({ tracks, eventEmitter });

			expect(player.tracks).toEqual(tracks);
			expect(player.eventEmitter).toBe(eventEmitter);
		});
	});

	// describe('.calculateTrackDuration', () => {
	//     describe('when the track has startedAt and endedAt timestamps');
	//     describe('when it does not have both of those timestamps');
	// });

	// describe('.calculateSongDuration', () => {
	//     // NOTE - hang on, what if a 2nd track starts say 2 seconds after the first one ends, but is very long?
	//     // it would then distort the song duration considerably - I think that this needs to be rethought

	// });

	// describe('.processEvent', () => {
	//     describe('when the event type is "pressKey"');
	//     describe('when the event type is "releaseKey"');
	// });

	// describe('.playTrack');

	// describe('.playSong');
});
