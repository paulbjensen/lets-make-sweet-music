<script lang="ts">
import { onMount } from "svelte";

const { defaultSettings, eventEmitter } = $props();

// ADSR values to be used for the synth
let attack = $state(defaultSettings.attack);
let decay = $state(defaultSettings.decay);
let sustain = $state(defaultSettings.sustain);
let release = $state(defaultSettings.release);

function updateADSR() {
	eventEmitter.emit("updateADSR", {
		attack,
		decay,
		sustain,
		release,
	});
}

type SettingsProps = {
	attack?: number | undefined;
	decay?: number | undefined;
	sustain?: number | undefined;
	release?: number | undefined;
};

/*
  If a keyboard event is received with a value for a setting, update the envelope settings
*/
function applyUpdatesToEnvelope(settings: SettingsProps) {
	if (settings?.attack !== undefined) {
		attack = settings.attack;
	}
	if (settings?.decay !== undefined) {
		decay = settings.decay;
	}
	if (settings?.sustain !== undefined) {
		sustain = settings.sustain;
	}
	if (settings?.release !== undefined) {
		release = settings.release;
	}
}

onMount(() => {
	eventEmitter.on("updateADSRFromKeyboard", (settings: SettingsProps) => {
		applyUpdatesToEnvelope(settings);
		updateADSR();
	});
});
</script>

<style>
  form {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 10px;
	background-color: #373632;
	border-radius: 8px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  }

  .form-header {
	font-weight: bold;
	font-size: 10px;
	text-transform: uppercase;
	text-align: center;
  }

    .control-group {
        display: flex;
    }

    label {
        min-width: 150px;
    }
  
</style>

 <form onchange={updateADSR}>
	<div class="form-header">ADSR Envelope settings</div>
    <div class="control-group">
        <label for="attack">
            Attack:
        </label>
        <input name="attack" type="range" min="0" max="1" step="0.01" bind:value={attack} />
    </div>    
    <div class="control-group">
        <label for="decay">
        Decay:
        </label>
        <input name="decay" type="range" min="0" max="1" step="0.01" bind:value={decay} />
    </div>    
    <div class="control-group">
      <label for="sustain">
        Sustain:
      </label>
	  <input name="sustain" type="range" min="0" max="1" step="0.01" bind:value={sustain} />
    </div>    
    <div class="control-group">
	  <label for="release">
	    Release:
	  </label>
	  <input name="release" type="range" min="0" max="1" step="0.01" bind:value={release} />
    </div>    
  </form>