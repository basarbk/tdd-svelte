<script>
  export let label = "", id = "", value = "", help = "";

</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <input id={id} class="form-control"
  class:is-invalid={help}
  bind:value />
  {#if help}
    <span class="invalid-feedback" role="alert">{help}</span>
  {/if}
</div>