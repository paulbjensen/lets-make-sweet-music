class EventEmitter {
	private events: { [key: string]: ((...args: unknown[]) => void)[] } = {};
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

	on(event: string, listener: (...args: unknown[]) => void) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	off(event: string, listener: (...args: unknown[]) => void) {
		if (!this.events[event]) return;

		this.events[event] = this.events[event].filter((l) => l !== listener);
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
