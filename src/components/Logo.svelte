<script lang="ts">
  import logo from '../assets/logo.svg';

  let { width, height } = $props();
  if (!width) width = 363;
  if (!height) height = 109;

</script>

<style>
  #logo {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
  }
</style>

<div id="logo">
  <img src={logo} alt="Let's make Sweet Music" {width} {height} fetchpriority="high" />
</div>
