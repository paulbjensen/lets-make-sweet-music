class EventEmitter {
	events: { [key: string]: ((...args: unknown[]) => void)[] } = {};
	enableLogging: boolean;

	constructor() {
		this.events = {};
		this.enableLogging = false;
	}

	log(...args: unknown[]) {
		if (this.enableLogging) {
			console.log(...args);
		}
	}

	on(eventOrEvents: string | string[], listener: (...args: unknown[]) => void) {
		if (Array.isArray(eventOrEvents)) {
			for (const event of eventOrEvents) {
				this.on(event, listener);
			}
			return;
		}
		if (!this.events[eventOrEvents]) {
			this.events[eventOrEvents] = [];
		}
		this.events[eventOrEvents].push(listener);
	}

	off(
		eventOrEvents: string | string[],
		listener: (...args: unknown[]) => void,
	) {
		if (Array.isArray(eventOrEvents)) {
			for (const event of eventOrEvents) {
				this.off(event, listener);
			}
			return;
		}
		if (!this.events[eventOrEvents]) return;

		this.events[eventOrEvents] = this.events[eventOrEvents].filter(
			(l) => l !== listener,
		);
	}

	emit(event: string, ...args: unknown[]) {
		this.log("Emitting event:", event, "with args:", ...args);
		if (!this.events[event]) return;

		for (const listener of this.events[event]) {
			listener(...args);
		}
	}
}

export default EventEmitter;
