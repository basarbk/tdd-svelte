<script>
  import { activate } from "../api/apiCalls";

  export let token;
  let apiCall = activate(token);
</script>

<div data-testid="activation-page">
  {#await apiCall}
    <span class="spinner-border spinner-border-sm" role="status"></span>
  {:then}
    <div class="alert alert-success mt-3">Account is activated</div>
  {:catch}
    <div class="alert alert-danger mt-3">Activation failure</div>
  {/await}
</div>