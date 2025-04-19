<script lang="ts">
const { eventEmitter, defaultSettings } = $props();

// biome-ignore lint/style/useConst: Set by the input bindings
let filterType: BiquadFilterType = $state(defaultSettings.filterType);
// biome-ignore lint/style/useConst: Set by the input bindings
let oscillatorType: OscillatorType = $state(defaultSettings.oscillatorType);
// biome-ignore lint/style/useConst: Set by the input bindings
let filterFrequency: number = $state(defaultSettings.filterFrequency);

function updateFilterAndOscillator() {
	eventEmitter.emit("updateFilterAndOscillator", {
		filterType,
		oscillatorType,
		filterFrequency,
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

<form onchange={updateFilterAndOscillator}>
	<div class="form-header">Filter and Oscillator settings</div>
    <div class="control-group">
        <label for="filterType">
            Filter Type:
        </label>
        <select name="filterType" bind:value={filterType}>
        <option value="lowpass">Low Pass</option>
        <option value="highpass">High Pass</option>
        <option value="bandpass">Band Pass</option>
        <option value="lowshelf">Low Shelf</option>
        <option value="highshelf">High Shelf</option>
        <option value="peaking">Peaking</option>
        <option value="notch">Notch</option>
        <option value="allpass">All Pass</option>
        </select>
    </div>
    <div class="control-group">
        <label for="oscillatorType">
            Oscillator Type:
        </label>
        <select name="oscillatorType" bind:value={oscillatorType}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
        </select>
    </div>
    <div class ="control-group">
        <label for="filterFrequency">
            Filter Frequency:
        </label>
        <input name="filterFrequency" type="range" min="0" max="5000" step="10" bind:value={filterFrequency} />
    </div>
  </form>