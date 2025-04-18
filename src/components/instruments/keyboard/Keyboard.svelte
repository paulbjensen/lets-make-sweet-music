<script lang="ts">
import { onDestroy, onMount } from "svelte";
const { eventEmitter } = $props();
import type { Key, KeyType } from "../../../types";
import KeyboardKey from "./KeyboardKey.svelte";

// Filter function to get only lower keys
const filterForKeyType = (type: KeyType) => (key: Key) => key.type === type;
let pressedKeys: string[] = $state([]);

// Used for dragging the keyboard around the screen
let left = $state(0);
let top = $state(0);
let moving = $state(false);

function onMouseDown() {
	moving = true;
}

function onMouseMove(e: MouseEvent) {
	if (moving && pressedKeys.length === 0) {
		left += e.movementX;
		top += e.movementY;
	}
}

function onMouseUp() {
	moving = false;
}

let octave = $state(0);
let velocity = $state(30);

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

/*
    What should the command look like for a keyboard keypress down and a keypress up?

    status: noteon  channel 1  note 60  velocity 100
    status: noteoff channel 1  note 60  velocity 100

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
	{ type: "lower", id: 8, note: "D4", shortcut: "l" },
	{ type: "upper", id: 9, note: "C#3", shortcut: "w" },
	{ type: "upper", id: 10, note: "D#3", shortcut: "e" },
	{ type: "upper", id: 11, note: "F#3", shortcut: "t" },
	{ type: "upper", id: 12, note: "G#3", shortcut: "y" },
	{ type: "upper", id: 12, note: "A#4", shortcut: "u" },
	{ type: "upper", id: 12, note: "C#4", shortcut: "o" },
];

/*
  This function is called when a key on the computer keyboard is pressed.
*/
function pressKey(note: string) {
	if (!pressedKeys.includes(note)) {
		pressedKeys = [...pressedKeys, note];
		eventEmitter.emit("pressKey", note, velocity);
	}
}

/*
  This function is called when a key on the computer keyboard is released.
*/
function releaseKey(note: string) {
	pressedKeys = pressedKeys.filter((key) => key !== note);
	eventEmitter.emit("releaseKey", note);
}

function increaseVelocity() {
	velocity = Math.min(velocity + 10, 127);
}

function describeVelocity() {
	velocity = Math.max(velocity - 10, 0);
}

function increaseOctave() {
	octave = Math.min(6, octave + 1);
}

function decreaseOctave() {
	octave = Math.max(-3, octave - 1);
}

function handleKeyDown(event: KeyboardEvent) {
	const lowercasedKey = event.key.toLowerCase();

	// NOTE - we convert to lowercase in case the user accidentally presses shift or has the caps lock on
	const note = keys.find((key: Key) => key.shortcut === lowercasedKey)?.note;
	if (note) {
		const octaveAppliedNote = applyOctave(note);
		if (!octaveAppliedNote) return;
		if (isOutOfRange(octaveAppliedNote)) return;
		pressKey(octaveAppliedNote);
	} else if (lowercasedKey === "c") {
		describeVelocity();
	} else if (lowercasedKey === "v") {
		increaseVelocity();
	} else if (lowercasedKey === "x") {
		increaseOctave();
	} else if (lowercasedKey === "z") {
		decreaseOctave();
	}
}

/*
  This function is called when a key on the computer keyboard is released.
*/
function handleKeyUp(event: KeyboardEvent) {
	// NOTE - we convert to lowercase in case the user accidentally presses shift or has the caps lock on
	const note = keys.find(
		(key: Key) => key.shortcut === event.key.toLowerCase(),
	)?.note;
	if (!note) return;
	const octaveAppliedNote = applyOctave(note);
	if (!octaveAppliedNote) return;
	if (isOutOfRange(octaveAppliedNote)) return;
	releaseKey(octaveAppliedNote);
}

function applyOctave(note: string) {
	const hasSharp = note.includes("#");
	const noteNumber = Number(note.match(/\d+/)?.[0]);
	const optionalSharp = hasSharp ? "#" : "";
	const newNote = note[0] + optionalSharp + (noteNumber + octave);
	return newNote;
}

onMount(() => {
	const keyboard = document.querySelector(".keyboard");

	/* bindings for keyboard actions */
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
	/* bindings for dragging the keyboard */
	if (keyboard) {
		keyboard.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		keyboard.addEventListener("mouseup", onMouseUp);
	}
});

/* When the component is destroyed, we want to remove the event listeners */
onDestroy(() => {
	const keyboard = document.querySelector(".keyboard");
	window.removeEventListener("keydown", handleKeyDown);
	window.removeEventListener("keyup", handleKeyUp);
	/* bindings for dragging the keyboard */
	if (keyboard) {
		keyboard.removeEventListener("mousedown", onMouseDown);
		window.removeEventListener("mousemove", onMouseMove);
		keyboard.removeEventListener("mouseup", onMouseUp);
	}
});

const outOfRangeNotes = ["C10", "D10", "A#10", "C#10"];
function isOutOfRange(note: string) {
	return outOfRangeNotes.includes(note);
}
</script>

<style>
    .keyboard {
        position: relative;
        padding: 10px;
        background-color: #373632;
        border-radius: 8px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
        width: intrinsic;
        cursor: grab;
    }

    .moving {
        cursor: grabbing;
    }

    .lower-keys {
        display: flex;
        justify-content: space-between;
    }

    .upper-keys {
        position: absolute;
        top: 0px;
        display: grid;
        grid-template-columns: repeat(6, auto);
    }

    .keys {
        position: relative;
        box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .attribute {
        display: block;
        font-family: monospace;
        background: rgb(69, 69, 168);
        color: lightblue;
        font-size: 10px;
        font-weight: bold;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        border-radius: 4px;
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.8);
        padding: 4px;
        min-width: 90px;
        text-align: center;
    }

    button {
        background: #373632;
        border: solid 1px rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 2px;
        width: 40px;
        height: 20px;
        font-size: 10px;
        box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    button:hover {
        background: #4f4e49;
    }

</style>

<div class="keyboard" style={`left: ${left}px; top: ${top}px;`} class:moving={moving}>
    <div class="controls">
        <button onclick={decreaseOctave}>- O</button>
        <div class="attribute">Octave: {octave}</div>
        <button onclick={increaseOctave}>+ O</button>
        <button onclick={describeVelocity}>- V</button>
        <div class="attribute">Velocity: {velocity}</div>
        <button onclick={increaseVelocity}>+ V</button>
    </div>
    <div class="keys">
        {#snippet keysOnKeyboard(containerClass:string, type:KeyType, keyClass:string)}        
            <div class={containerClass}>
                {#each keys.filter(filterForKeyType(type)) as key}
                    <KeyboardKey
                        {keyClass}
                        pressed={pressedKeys.includes(applyOctave(key.note))}
                        onmousedown={(e:MouseEvent) => { e.stopPropagation(); pressKey(applyOctave(key.note));}}
                        onmouseup={(e:MouseEvent) => { e.stopPropagation(); releaseKey(applyOctave(key.note));}}
                        id={key.id}
                        shortcut={key.shortcut}
                        note={applyOctave(key.note)}
                        showNote={true}
                        showShortcut={true}
                        disabled={isOutOfRange(applyOctave(key.note))}
                    />
                {/each}
            </div>
        {/snippet}
        {@render keysOnKeyboard('lower-keys', 'lower', 'lower-key')}
        {@render keysOnKeyboard('upper-keys', 'upper', 'upper-key')}
    </div>
</div>
