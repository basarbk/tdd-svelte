<script>
  export let size = "small";
</script>

<span
  class="spinner-border"
  class:spinner-border-sm={size === "small"}
  role="status">
</span>