<script lang="ts">
const { enabled } = $props();
</script>

<style>
    #recording-sign {
        color: red;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        opacity: 0.1;
    }

    #recording-sign.enabled {
        opacity: 1;
        text-shadow: 0px 0px 4px rgba(255,0,0,1);
    }
</style>

<div id="recording-sign" class={enabled ? 'enabled' : ''}>
    Recording
</div>