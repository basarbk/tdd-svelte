<script>
  import axios from 'axios';
  let disabled = true;
  let username, email, password, passwordRepeat;

  $: disabled = (password && passwordRepeat) ? password !== passwordRepeat : true;

  let apiProgress = false;

  let signUpSucess = false;

  let errors = {};

  const submit = () => {
    apiProgress = true;
    axios.post('/api/1.0/users', { username, email, password }).then(() => {
      signUpSucess = true;
    }).catch((error) => {
      if(error.response.status === 400) {
        errors = error.response.data.validationErrors;
      }
      apiProgress = false;
    })

  }

</script>
<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
  {#if !signUpSucess}
    <form class="card mt-5" data-testid="form-sign-up">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" class="form-control" bind:value={username}/>
          {#if errors.username}
            <span role="alert">{errors.username}</span>
          {/if}
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
          <button class="btn btn-primary" disabled={disabled || apiProgress} on:click|preventDefault={submit}>
            {#if apiProgress}
              <span class="spinner-border spinner-border-sm" role="status"></span>
            {/if}
            
            Sign Up</button>
        </div>
      </div>
    </form>
  {:else}
    <div class="alert alert-success mt-3">Please check your e-mail to activate your account</div>
  {/if}
</div>
