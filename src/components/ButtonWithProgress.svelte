<script>
  import Spinner from "./Spinner.svelte";

  export let disabled, apiProgress, onClick;

</script>
<button class="btn btn-primary" 
  disabled={disabled || apiProgress} 
  on:click|preventDefault={onClick}>
  {#if apiProgress}
    <Spinner />
  {/if}
  
  <slot>Button</slot>
</button>