import type EventEmitter from "@anephenix/event-emitter";
import type { EventMap } from "@anephenix/event-emitter";
import type Recording from "../Recording/Recording";

interface PlayerOptions {
	tracks: Recording[];
	eventEmitter: EventEmitter<EventMap>;
}

class Player {
	tracks: Recording[];
	eventEmitter: EventEmitter<EventMap>;

	constructor({ tracks, eventEmitter }: PlayerOptions) {
		this.tracks = tracks || [];
		this.eventEmitter = eventEmitter;
	}

	calculateTrackDuration(track: Recording) {
		const duration =
			track.endedAt && track.startedAt
				? track.endedAt - track.startedAt
				: track.events[track.events.length - 1].timestamp;
		return duration;
	}

	calculateSongDuration() {
		const startTimes = this.tracks
			.map((track) => track.startedAt)
			.filter((start) => start !== null) as number[];
		const endTimes = this.tracks
			.map((track) => track.endedAt)
			.filter((end) => end !== null) as number[];

		if (startTimes.length === 0 || endTimes.length === 0) {
			return 0; // No valid tracks to calculate duration
		}

		const earliestStart = Math.min(...startTimes);
		const latestEnd = Math.max(...endTimes);
		const duration = latestEnd - earliestStart;
		return duration > 0 ? duration : 0; // Ensure non-negative duration
	}

	processEvent(event: {
		timestamp: number;
		type: string;
		key: string;
		velocity?: number;
	}) {
		if (event.type === "pressKey") {
			this.eventEmitter.emit("pressKey", event.key, event.velocity);
		} else if (event.type === "releaseKey") {
			this.eventEmitter.emit("releaseKey", event.key);
		}
	}

	playTrack(track: Recording) {
		for (const event of track.events) {
			const delay = event.timestamp;
			setTimeout(() => {
				this.processEvent(event);
			}, delay);
		}
	}

	playSong() {
		if (this.tracks.length === 0) {
			console.log("No tracks to play");
			this.eventEmitter.emit("finishPlayingTracks");
			return;
		}

		const duration = this.calculateSongDuration();
		setTimeout(() => {
			this.eventEmitter.emit("finishPlayingTracks");
		}, duration);

		for (const track of this.tracks) {
			this.playTrack(track);
		}
	}
}

export default Player;
