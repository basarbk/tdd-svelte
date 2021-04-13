<script>
  import { locale } from "svelte-i18n";
</script>

<img src="https://www.countryflags.io/tr/flat/24.png" alt="Turkish Flag" title="Türkçe" on:click={() => locale.set("tr")} />
<img src="https://www.countryflags.io/us/flat/24.png" alt="English Flag" title="English" on:click={() => locale.set("en")} />

<style>
  img {
    cursor: pointer;
  }
</style>