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
</style>

 <form onchange={updateADSR}>
	<div class="form-header">ADSR Envelope settings</div>
	<label>
	  Attack:
	  <input type="range" min="0" max="1" step="0.01" bind:value={attack} />
	</label>
	<label>
	  Decay:
	  <input type="range" min="0" max="1" step="0.01" bind:value={decay} />
	</label>
	<label>
	  Sustain:
	  <input type="range" min="0" max="1" step="0.01" bind:value={sustain} />
	</label>
	<label>
	  Release:
	  <input type="range" min="0" max="1" step="0.01" bind:value={release} />
	</label>
  </form>