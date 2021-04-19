<script>
  import { getUserById } from "../api/apiCalls";
  import ProfileCard from "../components/ProfileCard.svelte";
  import Spinner from "../components/Spinner.svelte";
  export let id;

  let apiCall = getUserById(id)
</script>

<div data-testid="user-page">
  {#await apiCall}
    <div class="alert alert-secondary text-center">
      <Spinner size="normal"/>
    </div>
  {:then response}
    <ProfileCard user={response.data} />
  {:catch error}
    <div class="alert alert-danger text-center">
      {error.response.data.message}
    </div>
  {/await}
</div>