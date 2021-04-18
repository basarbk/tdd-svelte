<script>

  import { loadUsers } from "../api/apiCalls";

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
    {#each page.content as user}
      <li class="list-group-item list-group-item-action">{user.username}</li>
    {/each}
  </ul>
  {#if page.page > 0}
    <button on:click={() => loadData(page.page - 1)} >&lt; previous</button>
  {/if}
  {#if page.page < page.totalPages - 1}
    <button on:click={() => loadData(page.page + 1)}>next &gt;</button>
  {/if}
  
</div>