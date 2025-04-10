export type KeyType = "lower" | "upper";

export type Key = {
	id: number;
	note: string;
	shortcut: string;
	type: KeyType;
};

export type Note = {
	key: string;
	pressedAt: number;
	releasedAt: number | null;
};
