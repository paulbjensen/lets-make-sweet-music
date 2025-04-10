type RecordingEvent = {
	timestamp: number;
	type: "pressKey" | "releaseKey";
	key: string;
};

import type { Note } from "../../types";

class Recording {
	status: "recording" | "stopped";
	events: RecordingEvent[];
	startedAt?: number | null;
	endedAt?: number | null;
	constructor() {
		this.startedAt = null;
		this.endedAt = null;
		this.events = [];
		this.status = "stopped";
	}

	// Starts the recording
	start() {
		this.status = "recording";
		this.startedAt = Date.now();
		this.events = [];
	}

	addEvent({ type, key }: Pick<RecordingEvent, "type" | "key">) {
		if (this.status !== "recording") return;
		const event: RecordingEvent = {
			timestamp: Date.now() - (this.startedAt ?? 0),
			type,
			key,
		};
		this.events.push(event);
	}

	stop() {
		this.status = "stopped";
		this.endedAt = Date.now();
	}

	notesPlayed(): Note[] {
		const notes: {
			key: string;
			pressedAt: number;
			releasedAt: number | null;
		}[] = [];

		const keyPressMap = new Map<string, number>();

		for (const event of this.events) {
			if (event.type === "pressKey") {
				keyPressMap.set(event.key, event.timestamp);
			} else if (event.type === "releaseKey") {
				const pressedAt = keyPressMap.get(event.key);
				if (pressedAt !== undefined) {
					notes.push({
						key: event.key,
						pressedAt,
						releasedAt: event.timestamp,
					});
					keyPressMap.delete(event.key);
				}
			}
		}

		// Handle keys that were pressed but not released
		for (const [key, pressedAt] of keyPressMap.entries()) {
			notes.push({
				key,
				pressedAt,
				releasedAt: null,
			});
		}

		return notes;
	}
}

export default Recording;
export type { RecordingEvent };
