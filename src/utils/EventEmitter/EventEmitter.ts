class EventEmitter {
	private events: { [key: string]: ((...args: unknown[]) => void)[] } = {};

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
		if (!this.events[event]) return;

		for (const listener of this.events[event]) {
			listener(...args);
		}
	}
}

export default EventEmitter;
