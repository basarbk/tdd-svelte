<script>
  import { getUserById } from "../api/apiCalls";
  import ProfileCard from "../components/ProfileCard.svelte";
  export let id;

  let user = {};
  
  getUserById(id).then(response => {
    user = response.data
  })
</script>

<div data-testid="user-page">
  <ProfileCard {user} />
</div>