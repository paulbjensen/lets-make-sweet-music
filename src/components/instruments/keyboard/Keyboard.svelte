<script lang="ts">
import { onDestroy, onMount } from "svelte";
const { keys, pressKey, releaseKey, pressedKeys } = $props();
import type { Key, KeyType } from "../../../types";
import KeyboardKey from "./KeyboardKey.svelte";

// Filter function to get only lower keys
const filterForKeyType = (type: KeyType) => (key: Key) => key.type === type;

// Potential refactoring of html
// const keySet = [
//     { class: 'lower-keys', type: 'lower' },
//     { class: 'upper-keys', type: 'upper' }
// ];

/*
    This function is called when a key on the computer keyboard is pressed.
  */
function handleKeyPress(event: KeyboardEvent) {
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
	window.addEventListener("keypress", handleKeyPress);
	window.addEventListener("keyup", handleKeyUp);
});

/* When the component is destroyed, we want to remove the event listeners */
onDestroy(() => {
	window.removeEventListener("keypress", handleKeyPress);
	window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style>
    .keyboard {
        position: relative;
        padding: 10px;
        background-color: rgb(200, 136, 59);
        border-radius: 5px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
        width: intrinsic;
    }

    .lower-keys {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .upper-keys {
        position: absolute;
        top: 20px;
        display: grid;
        grid-template-columns: auto auto auto auto auto;
    }

    .keys {
        position: relative;
    }

    .keyboard-top-case {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        height: 40px;
        background-color: rgb(200, 136, 59);
        border-radius: 5px 5px 0 0;
        box-shadow: 0px 8px 2px rgba(0, 0, 0, 0.5);
        background-color: rgb(200, 136, 59);
        z-index: 3;
    }

</style>

<div class="keyboard">
    <div class="keys">
        <div class="lower-keys">
            {#each keys.filter(filterForKeyType('lower')) as key}
                <KeyboardKey
                    keyClass="lower-key"
                    pressed={pressedKeys.includes(key.note)}
                    onmousedown={() => { pressKey(key.note);}}
                    onmouseup={() => { releaseKey(key.note);}}
                    id={key.id}
                    shortcut={key.shortcut}
                    note={key.note}
                />
            {/each}
        </div>
        <div class="upper-keys">
            {#each keys.filter(filterForKeyType('upper')) as key}
                <KeyboardKey
                    keyClass="upper-key"
                    pressed={pressedKeys.includes(key.note)}
                    onmousedown={() => { pressKey(key.note);}}
                    onmouseup={() => { releaseKey(key.note);}}
                    id={key.id}
                    shortcut={key.shortcut}
                    note={key.note}
                />
            {/each}
        </div>
    </div>
    <div class="keyboard-top-case"></div>
</div>