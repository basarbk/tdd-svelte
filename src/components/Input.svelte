<script>
  export let label = "", id = "", help = "", type = "text";

</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <input 
    id={id}
    class="form-control"
    class:is-invalid={help}
    type={type}
    on:input
     />
  {#if help}
    <span class="invalid-feedback" role="alert">{help}</span>
  {/if}
</div>