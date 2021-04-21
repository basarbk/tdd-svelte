<script>
  import Input from '../components/Input.svelte';
  import { login } from "../api/apiCalls";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";
  import ButtonWithProgress from "../components/ButtonWithProgress.svelte";

  let email, password;

  let disabled = true;

  let apiProgress = false;

  let failMessage;

  const onChange = event => {
    const { id, value } = event.target;
    if(id === "email"){
      email = value;
    } else {
      password = value;
    }
    failMessage = undefined;
    disabled = (email && password) ? false : true;
  }

  const onClick = async () => {
    apiProgress = true;
    try {
      await login({email, password});
      navigate("/");
    } catch (error){
      failMessage = error.response.data.message;
    }
    apiProgress = false;
  }

</script>

<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="login-page">
  <form class="card mt-5" data-testid="form-sign-up">
    <div class="card-header">
      <h1 class="text-center">{$_("login")}</h1>
    </div>
    <div class="card-body">
      <Input id="email" label={$_("email")} on:input={onChange} />
      <Input id="password" label={$_("password")} type="password" on:input={onChange}/>
      {#if failMessage}
        <div class="alert alert-danger text-center">
          {failMessage}
        </div>
      {/if}
      <div class="text-center">
        <ButtonWithProgress {disabled} {apiProgress} {onClick}>
          {$_("login")}
        </ButtonWithProgress>
      </div>
    </div>
  </form>
</div>