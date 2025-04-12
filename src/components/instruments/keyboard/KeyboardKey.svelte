<script lang="ts">
const { keyClass, pressed, onmousedown, onmouseup, id, shortcut, note } =
	$props();
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
        left: 128px;
    }
    .upper-key:nth-of-type(5) {
        left: 144px;
    }

    .key-note {
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 18px;
        color: #48494A;
        text-transform: uppercase;
    }

    .key-shortcut {
        font-size: 18px;
        color: #aeaeae;
        text-transform: uppercase;
    }

    .upper-key .key-note {
        font-size: 12px;
        color: white;
    }
    .upper-key .key-shortcut {
        font-size: 12px;
        color: #ccc;
    }

    .lower-key:hover, .upper-key:hover {
        cursor: pointer;
    }

    .pressed {
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.5),
        0px 1px 1px rgba(0, 0, 0, 0.5);
    }

</style>

<button class={[keyClass, {pressed}]}
    {onmousedown}
    {onmouseup}
    data-id={id}
>
    <div class="key-note">
        {note}
    </div>
    <div class="key-shortcut">
        {shortcut}
    </div>
</button>
