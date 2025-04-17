<script lang="ts">
const {
	keyClass,
	pressed,
	onmousedown,
	onmouseup,
	id,
	shortcut,
	note,
	showNote,
	showShortcut,
	disabled,
} = $props();
</script>

<style>
    .lower-key {
        width: 50px;
        height: 200px;
        background-color: #EEE5D5;
        border: 1px solid #A39D95;
        margin: 0px;
        position: relative;
        z-index: 1;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
        touch-action: manipulation;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 10px;
    }

    .lower-key:first-of-type {
        border-top-left-radius: 4px;
    }

    .lower-key:last-of-type {
        border-top-right-radius: 4px;
    }

    .upper-key {
        width: 35px;
        height: 120px;
        background-color: #2D2F2B;
        border: 1px solid #2D2F2B;
        margin: 0px;
        position: relative;
        z-index: 1;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        touch-action: manipulation;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 10px;
    }

    .upper-key:nth-of-type(1) {
        left: 32px;
    }

    .upper-key:nth-of-type(2) {
        left: 48px;
    }
    .upper-key:nth-of-type(3) {
        left: 112px;
    }
    .upper-key:nth-of-type(4) {
        left: 127px;
    }
    .upper-key:nth-of-type(5) {
        left: 142px;
    }

    .upper-key:nth-of-type(6) {
        left: 208px;
    }


    .key-note {
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 18px;
        color: #48494A;
        text-transform: uppercase;
    }

    .key-shortcut {
        margin-top: 4px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        width: 18px;
        height: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        color: #aeaeae;
        border: solid 1px #c9c9c9;
        text-transform: uppercase;
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.1);
    }

    .upper-key .key-note {
        font-size: 12px;
        color: white;
    }
    .upper-key .key-shortcut {
        font-size: 10px;
        color: #aeaeae;
        border: solid 1px #c9c9c9;
        box-shadow: inset 0px 0px 4px rgba(255, 255, 255, 0.1);
    }

    .lower-key:hover, .upper-key:hover {
        cursor: pointer;
    }

    .pressed {
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.5),
        0px 1px 1px rgba(0, 0, 0, 0.5);
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

</style>

<button class={[keyClass, {pressed}]}
    {onmousedown}
    {onmouseup}
    data-id={id}
    {disabled}
>
    {#if showNote}
        <div class="key-note">
            {note}
        </div>
    {/if}
    {#if showShortcut}
        <div class="key-shortcut">
            {shortcut}
        </div>
    {/if}
</button>
