<script>

  import { loadUsers } from "../api/apiCalls";

  let page = {
    content: []
  }

  const loadData = async () => {
    const result = await loadUsers();
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
</div>