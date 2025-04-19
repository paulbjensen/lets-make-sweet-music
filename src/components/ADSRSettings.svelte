<script lang="ts">
const { defaultSettings, eventEmitter } = $props();

// ADSR values to be used for the synth
// biome-ignore lint/style/useConst: Set by the input bindings
let attack = $state(defaultSettings.attack);
// biome-ignore lint/style/useConst: Set by the input bindings
let decay = $state(defaultSettings.decay);
// biome-ignore lint/style/useConst: Set by the input bindings
let sustain = $state(defaultSettings.sustain);
// biome-ignore lint/style/useConst: Set by the input bindings
let release = $state(defaultSettings.release);

function updateADSR() {
	eventEmitter.emit("updateADSR", {
		attack,
		decay,
		sustain,
		release,
	});
}
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