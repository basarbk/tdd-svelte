<script>
  export let user;
</script>

<div class="card text-center">
  <div class="card-header">
    <img 
      src="/assets/profile.png" 
      alt="profile" 
      width="200"
      class="rounded-circle shadow"/>
  </div>
  <div class="card-body">
    <h3>{user.username}</h3>
  </div>
</div>