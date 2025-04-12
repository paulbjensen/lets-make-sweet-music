<script lang="ts">
import { onDestroy, onMount } from "svelte";
const { eventEmitter } = $props();
import type { Key, KeyType } from "../../../types";
import KeyboardKey from "./KeyboardKey.svelte";

// Filter function to get only lower keys
const filterForKeyType = (type: KeyType) => (key: Key) => key.type === type;
let pressedKeys: string[] = $state([]);

/* 
    This is a list of keys that are available on the keyboard.
    The keys are divided into two types: upper and lower.
    The lower keys are the ones that are used for the white keys.
    The upper keys (the ones in black) are yet to be implemented.

    At some point I want to make this a configurable property so that
    the user can choose:

    - What keys are available, in what layout
    - What keyboard shortcuts they are mapped to

    // This feels like it belongs to an instrument instance,
    // in a sequence of instruments.
  */
const keys: Key[] = [
	{ type: "lower", id: 1, note: "C3", shortcut: "a" },
	{ type: "lower", id: 2, note: "D3", shortcut: "s" },
	{ type: "lower", id: 3, note: "E3", shortcut: "d" },
	{ type: "lower", id: 4, note: "F3", shortcut: "f" },
	{ type: "lower", id: 5, note: "G3", shortcut: "g" },
	{ type: "lower", id: 6, note: "A3", shortcut: "h" },
	{ type: "lower", id: 7, note: "B3", shortcut: "j" },
	{ type: "lower", id: 8, note: "C4", shortcut: "k" },
	// { type: 'lower', id: 8, note: 'D4', shortcut: 'l' },
	{ type: "upper", id: 9, note: "C#3", shortcut: "w" },
	{ type: "upper", id: 10, note: "D#3", shortcut: "e" },
	{ type: "upper", id: 11, note: "F#3", shortcut: "t" },
	{ type: "upper", id: 12, note: "G#3", shortcut: "y" },
	{ type: "upper", id: 12, note: "A#3", shortcut: "o" },
];

/*
  This function is called when a key on the computer keyboard is pressed.
*/
function pressKey(note: string) {
	if (!pressedKeys.includes(note)) {
		pressedKeys = [...pressedKeys, note];
	}
	eventEmitter.emit("pressKey", note);
}

/*
  This function is called when a key on the computer keyboard is released.
*/
function releaseKey(note: string) {
	pressedKeys = pressedKeys.filter((key) => key !== note);
	eventEmitter.emit("releaseKey", note);
}

function handleKeyDown(event: KeyboardEvent) {
	const note = keys.find((key: Key) => key.shortcut === event.key)?.note;
	if (!note) return;
	pressKey(note);
}

/*
  This function is called when a key on the computer keyboard is released.
*/
function handleKeyUp(event: KeyboardEvent) {
	const note = keys.find((key: Key) => key.shortcut === event.key)?.note;
	if (!note) return;
	releaseKey(note);
}

onMount(() => {
	/* bindings for keyboard actions */
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
});

/* When the component is destroyed, we want to remove the event listeners */
onDestroy(() => {
	window.removeEventListener("keydown", handleKeyDown);
	window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style>
    .keyboard {
        position: relative;
        padding: 10px;
        background-color: #373632;
        border-radius: 8px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
        width: intrinsic;
    }

    .lower-keys {
        display: flex;
        justify-content: space-between;
    }

    .upper-keys {
        position: absolute;
        top: 0px;
        display: grid;
        grid-template-columns: auto auto auto auto auto;
    }

    .keys {
        position: relative;
        box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

</style>

<div class="keyboard">
    <div class="keys">
        {#snippet keysOnKeyboard(containerClass:string, type:KeyType, keyClass:string)}        
            <div class={containerClass}>
                {#each keys.filter(filterForKeyType(type)) as key}
                    <KeyboardKey
                        {keyClass}
                        pressed={pressedKeys.includes(key.note)}
                        onmousedown={() => { pressKey(key.note);}}
                        onmouseup={() => { releaseKey(key.note);}}
                        id={key.id}
                        shortcut={key.shortcut}
                        note={key.note}
                        showNote={false}
                        showShortcut={true}
                    />
                {/each}
            </div>
        {/snippet}
        {@render keysOnKeyboard('lower-keys', 'lower', 'lower-key')}
        {@render keysOnKeyboard('upper-keys', 'upper', 'upper-key')}
    </div>
</div>