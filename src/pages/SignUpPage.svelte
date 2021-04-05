<script>
  import axios from 'axios';
  let disabled = true;
  let username, email, password, passwordRepeat;

  $: disabled = (password && passwordRepeat) ? password !== passwordRepeat : true;

  const submit = () => {
    axios.post('/api/1.0/users', { username, email, password });
  }

</script>
<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
  <form class="card mt-5">
    <div class="card-header">
      <h1 class="text-center">Sign Up</h1>
    </div>
    <div class="card-body">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" class="form-control" bind:value={username}/>
      </div>
      <div class="form-group">
        <label for="e-mail">E-mail</label>
        <input id="e-mail" class="form-control" bind:value={email}/>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" class="form-control" bind:value={password}/>
      </div>
      <div class="form-group">
        <label for="password-repeat">Password Repeat</label>
        <input id="password-repeat" type="password" class="form-control" bind:value={passwordRepeat}/>
      </div>
      <div class="text-center">
        <button class="btn btn-primary" {disabled} on:click|preventDefault={submit}>Sign Up</button>
      </div>
    </div>
  </form>
</div>
