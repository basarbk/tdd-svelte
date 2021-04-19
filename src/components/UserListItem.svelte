<script>

  import { link } from "svelte-routing";
  export let user;
</script>

<a 
  href={`/user/${user.id}`}
  use:link
  class="list-group-item list-group-item-action">
  
  <img src="/assets/profile.png" alt="profile" width="30" class="rounded-circle shadow-sm"/>
  {user.username}
</a>