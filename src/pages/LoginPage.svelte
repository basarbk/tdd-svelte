<script>
  import Input from '../components/Input.svelte';

  let email, password;

  let disabled = true;

  const onChange = event => {
    const { id, value } = event.target;
    if(id === "email"){
      email = value;
    } else {
      password = value;
    }
    disabled = (email && password) ? false : true;
  }

</script>

<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="login-page">
  <form class="card mt-5" data-testid="form-sign-up">
    <div class="card-header">
      <h1 class="text-center">Login</h1>
    </div>
    <div class="card-body">
      <Input id="email" label="E-mail" on:input={onChange} />
      <Input id="password" label="Password" type="password" on:input={onChange}/>
      <div class="text-center">
        <button class="btn btn-primary" {disabled}>Login</button>
      </div>
    </div>
  </form>
</div>