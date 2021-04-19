<script>
  import { fade } from "svelte/transition";
  import { loadUsers } from "../api/apiCalls";
  import UserListItem from "./UserListItem.svelte";

  let page = {
    content: []
  }

  const loadData = async (pageNumber) => {
    const result = await loadUsers(pageNumber);
    page = result.data
  }

  loadData();

</script>

<div class="card">
  <div class="card-header text-center">
    <h3>Users</h3>
  </div>
  <ul class="list-group list-group-flush">
    {#each page.content as user (user.id)}
      <UserListItem {user} />
    {/each}
  </ul>
  <div class="card-footer">
    {#if page.page > 0}
      <button class="btn btn-outline-secondary btn-sm" 
      in:fade
      on:click={() => loadData(page.page - 1)} >&lt; previous</button>
    {/if}
    {#if page.page < page.totalPages - 1}
      <button class="btn btn-outline-secondary btn-sm float-right" 
      in:fade
      on:click={() => loadData(page.page + 1)}>next &gt;</button>
    {/if}
  </div>
  
</div>