type RecordingEvent = {
    timestamp: number;
    type: 'pressKey' | 'releaseKey';
    key: string;
}

class Recording {
    status: 'recording' | 'stopped';
    events: RecordingEvent[];
    startedAt?: number | null;
    endedAt?: number | null;
    constructor() {
        this.startedAt = null;
        this.endedAt = null;
        this.events = [];       
        this.status = 'stopped';
    }

    // Starts the recording
    start() {   
        this.status = 'recording';
        this.startedAt = Date.now();
        this.events = [];
    }

    addEvent({type, key}: Pick<RecordingEvent, 'type' | 'key'>) {
        if (this.status !== 'recording') return;
        const event: RecordingEvent = {
            timestamp: Date.now() - (this.startedAt ?? 0),
            type,
            key
        };
        this.events.push(event);
    }

    stop() {
        this.status = 'stopped';
        this.endedAt = Date.now();
    }
        
}

export default Recording;
export type { RecordingEvent };