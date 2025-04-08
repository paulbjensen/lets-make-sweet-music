<script lang="ts">

const { keyClass, pressed, onmousedown, onmouseup, id, shortcut, note } = $props();

</script>

<style>

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

    .upper-key {
        width: 45px;
        height: 100px;
        background-color: black;
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

    .upper-key:nth-of-type(1) {
        left: 25px;
    }

    .upper-key:nth-of-type(2) {
        left: 30px;
    }
    .upper-key:nth-of-type(3) {
        left: 85px;
    }
    .upper-key:nth-of-type(4) {
        left: 90px;
    }
    .upper-key:nth-of-type(5) {
        left: 95px;
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

    .upper-key .key-note {
        font-size: 16px;
        font-weight: 400;
        color: white;
    }
    .upper-key .key-shortcut {
        font-size: 16px;
        color: #ccc;
    }

    .lower-key:hover, .upper-key:hover {
        background-color: rgb(250, 226, 72);
        cursor: pointer;
    }

    .pressed {
        background-color: rgb(255, 160, 45);
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5),
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
