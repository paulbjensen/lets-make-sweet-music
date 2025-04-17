interface EventEmitterInterface {
	typedEvents?: string[];
}

class EventEmitter {
	typedEvents?: string[] | undefined;
	events: { [key: string]: ((...args: unknown[]) => void)[] } = {};
	enableLogging: boolean;

	constructor({ typedEvents }: EventEmitterInterface = {}) {
		this.events = {};
		this.enableLogging = false;
		if (typedEvents) {
			this.typedEvents = typedEvents;
			for (const event of typedEvents) {
				this.events[event] = [];
			}
		}
	}

	log(...args: unknown[]) {
		if (this.enableLogging) {
			console.log(...args);
		}
	}

	checkIfEventIsTyped(event: string) {
		if (this.typedEvents && !this.typedEvents.includes(event)) {
			throw new Error(`Event '${event}' is not defined in typedEvents`);
		}
	}

	on(eventOrEvents: string | string[], listener: (...args: unknown[]) => void) {
		if (Array.isArray(eventOrEvents)) {
			for (const event of eventOrEvents) {
				this.on(event, listener);
			}
			return;
		}
		this.checkIfEventIsTyped(eventOrEvents);
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
		this.checkIfEventIsTyped(eventOrEvents);
		if (!this.events[eventOrEvents]) return;

		this.events[eventOrEvents] = this.events[eventOrEvents].filter(
			(l) => l !== listener,
		);
	}

	emit(event: string, ...args: unknown[]) {
		this.checkIfEventIsTyped(event);
		this.log("Emitting event:", event, "with args:", ...args);
		if (!this.events[event]) return;

		for (const listener of this.events[event]) {
			listener(...args);
		}
	}
}

export default EventEmitter;
