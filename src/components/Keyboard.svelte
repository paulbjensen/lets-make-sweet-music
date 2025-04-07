<script lang="ts">
    const { keys, pressKey, releaseKey, pressedKeys } = $props();
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

    .keys {
        position: relative;
    }

    .lower-key {
        width: 50px;
        height: 200px;
        background-color: white;
        border: 1px solid black;
        margin: 0px;
        position: relative;
        z-index: 1;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
        touch-action: manipulation;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 10px;
    }

    .pressed {
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5),
        0px 1px 1px rgba(0, 0, 0, 0.5);
    }

    .key-note {
        font-size: 18px;
        font-weight: bold;
        font-style: italic;
        color: #333;
        text-transform: uppercase;
    }

    .key-shortcut {
        font-size: 18px;
        font-weight: bold;
        color: #ccc;
        text-transform: uppercase;
    }

    .lower-key:hover {
        background-color: rgb(250, 226, 72);
        cursor: pointer;
    }

    .lower-key:active, .pressed {
        background-color: rgb(255, 160, 45);
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
            {#each keys.filter(key => key.type === 'lower') as key}
                <button class="lower-key {pressedKeys.includes(key.note) ? 'pressed' : ''}"
                    onmousedown={() => { pressKey(key.note);}}
                    onmouseup={() => { releaseKey(key.note);}}
                    data-id={key.id}
                >
                    <div class="key-note">
                      {key.note}
                    </div>
                    <div class="key-shortcut">
                      {key.shortcut}
                    </div>
                </button>
            {/each}
        </div>
    </div>
    <div class="keyboard-top-case"></div>
</div>