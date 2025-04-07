export type KeyType = 'lower' | 'upper';

export type Key = {
    id: string;
    note: string;
    shortcut: string;
    type: KeyType;
};