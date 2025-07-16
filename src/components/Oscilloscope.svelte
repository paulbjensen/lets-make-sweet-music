
<script lang="ts">
const { analyser, dataArray, bufferLength } = $props();

import { onMount } from "svelte";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

function load() {
	canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
	if (!canvas) throw new Error("Canvas not found");
	ctx = canvas.getContext("2d");
	canvas.width = 220;
	canvas.height = 40;
	draw();
}

onMount(load);

function draw() {
	requestAnimationFrame(draw);

	analyser.getByteTimeDomainData(dataArray);
	if (!canvas) throw new Error("Canvas not found");
	if (!ctx) throw new Error("Canvas context not found");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "lime";
	ctx.beginPath();

	const sliceWidth = (canvas.width * 1.0) / bufferLength;
	let x = 0;

	for (let i = 0; i < bufferLength; i++) {
		const v = dataArray[i] / 128.0;
		const y = (v * canvas.height) / 2;

		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}

		x += sliceWidth;
	}

	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();
}
</script>

<style>
    .oscilloscope-bg {
        background-color: #000;
        background-image: 
        linear-gradient(to right, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
        background-size: 10px 10px;
        border-radius: 4px;
    }
</style>

<div class="oscilloscope-bg">
    <canvas id="oscilloscope"></canvas>
</div>
