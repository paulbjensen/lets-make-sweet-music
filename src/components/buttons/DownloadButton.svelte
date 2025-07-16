<script lang="ts">
const { onclick, enabled } = $props();

import downloadIcon from "../../assets/icons/download.svg";
</script>

<style>
    .download-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        cursor: pointer;
        background: none;
        border: none;
        opacity: 1;
    }

    .download-button:disabled {
        opacity: 0.1;
    }
</style>

<button class="download-button" disabled={!enabled} onclick={onclick} aria-label="Save track to your computer">
    <img src={downloadIcon} alt="Download" width="24" height="24" />
</button>
