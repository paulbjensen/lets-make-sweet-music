<script lang="ts">
import removeIcon from "../../assets/icons/remove.svg";

const { onclick, disabled } = $props();
</script>

<style>
     .remove-button {
        background: linear-gradient(180deg, #E02020 0%, #ff2f2c 100%);
        border: none;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 4px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5), inset 0px 0px 4px rgba(255, 255, 255, 0.5);
    }

    .remove-button > img {
        pointer-events: none;
    }

    .remove-button:disabled {
        cursor: not-allowed;
        opacity: 0.1;
    }

</style>

<button class="remove-button" onclick={onclick} {disabled}>
    <img src={removeIcon} alt="Remove Track" width="24" height="24" />
</button>