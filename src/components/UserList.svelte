<script>
  import { _ } from "svelte-i18n";
  import { fade } from "svelte/transition";
  import { loadUsers } from "../api/apiCalls";
  import UserListItem from "./UserListItem.svelte";
  import Spinner from "./Spinner.svelte";
  import Card from "./Card.svelte";

  let pendingApiCall;

  let page = {
    content: []
  }

  const loadData = async (pageNumber) => {
    pendingApiCall = true;
    const result = await loadUsers(pageNumber);
    page = result.data
    pendingApiCall = false;
  }

  loadData();

</script>

<Card>
  <h3 slot="header">{$_("users")}</h3>
  <ul class="list-group list-group-flush">
    {#each page.content as user (user.id)}
      <UserListItem {user} />
    {/each}
  </ul>
  <div slot="footer">
    {#if pendingApiCall}
      <Spinner size="normal"/>
    {:else}
      {#if page.page > 0}
        <button class="btn btn-outline-secondary btn-sm float-left" 
        in:fade
        on:click={() => loadData(page.page - 1)} >{$_("previousPage")}</button>
      {/if}
      {#if page.page < page.totalPages - 1}
        <button class="btn btn-outline-secondary btn-sm float-right" 
        in:fade
        on:click={() => loadData(page.page + 1)}>{$_("nextPage")}</button>
      {/if}
    {/if}
  </div>

</Card>