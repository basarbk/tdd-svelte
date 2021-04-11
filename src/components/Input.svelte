<script>

  import { onMount } from "svelte";

  export let label = "", id = "", value = "", help = "", type = "text";

  let inputElement;

  onMount(() => {
    inputElement.type = type;
  })

</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <input 
    bind:this={inputElement}
    id={id}
    class="form-control"
    class:is-invalid={help}
    bind:value />
  {#if help}
    <span class="invalid-feedback" role="alert">{help}</span>
  {/if}
</div>