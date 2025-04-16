import type EventEmitter from "../EventEmitter/EventEmitter";
import type Recording from "../Recording/Recording";

interface PlayerOptions {
	tracks: Recording[];
	eventEmitter: EventEmitter;
}

class Player {
	tracks: Recording[];
	eventEmitter: EventEmitter;

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
		const durations = this.tracks.map(this.calculateTrackDuration);
		const duration = Math.max(...durations);
		return duration;
	}

	processEvent(event: { timestamp: number; type: string; key: string }) {
		if (event.type === "pressKey") {
			this.eventEmitter.emit("pressKey", event.key);
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
