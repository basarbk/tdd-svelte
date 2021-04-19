<script>
  import { getUserById } from "../api/apiCalls";
  import ProfileCard from "../components/ProfileCard.svelte";
  import Spinner from "../components/Spinner.svelte";
  export let id;

  let user = {};
  
  let apiCall = getUserById(id).then(response => {
    user = response.data
  })
</script>

<div data-testid="user-page">
  {#await apiCall}
    <div class="alert alert-secondary text-center">
      <Spinner size="normal"/>
    </div>
  {:then}
    <ProfileCard {user} />
  {/await}
</div>