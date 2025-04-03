<script lang="ts">

    const { playSound, pressedKey } = $props();

    const keys = [
        { type: 'upper', id: 1, shortcut: 'a' },
        { type: 'upper', id: 2, shortcut: 's' },
        { type: 'upper', id: 3, shortcut: 'd' },
        { type: 'upper', id: 4, shortcut: 'f' },
        { type: 'upper', id: 5, shortcut: 'g' },
        { type: 'upper', id: 6, shortcut: 'h' },
        { type: 'upper', id: 7, shortcut: 'j' },
        { type: 'upper', id: 8, shortcut: 'k' },
    ];

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

    .upper-keys {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .keys {
        position: relative;
    }

    .upper-key {
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
    }

    .pressed {
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5),
        0px 1px 1px rgba(0, 0, 0, 0.5);
    }

    .key-label {
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
        font-weight: bold;
        color: #ccc;
        text-align: center;
        text-transform: uppercase;
    }

    .upper-key:hover {
        background-color: rgb(250, 226, 72);
        cursor: pointer;
    }

    .upper-key:active, .pressed {
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
        <div class="upper-keys">
            {#each keys.filter(key => key.type === 'upper') as key}
                <button class="upper-key {pressedKey === key.shortcut ? 'pressed' : ''}"
                     onclick={() => { playSound(key.shortcut);}}
                     data-id={key.id}
                >
                    <div class="key-label">
                        {key.shortcut}
                    </div>
                </button>
            {/each}
        </div>
    </div>
    <div class="keyboard-top-case"></div>
</div>