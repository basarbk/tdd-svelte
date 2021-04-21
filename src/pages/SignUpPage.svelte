<script>
  import { _ } from "svelte-i18n";
  import Input from '../components/Input.svelte';
  import { signup } from "../api/apiCalls";
  import ButtonWithProgress from "../components/ButtonWithProgress.svelte";
  import Card from "../components/Card.svelte";

  let disabled = true;
  let form = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: ''
  }
  

  let passwordMismatch = false;

  $: disabled = (form.password && form.passwordRepeat) ? form.password !== form.passwordRepeat : true;

  $: passwordMismatch = form.password !== form.passwordRepeat;

  let apiProgress = false;

  let signUpSucess = false;

  let errors = {};

  const submit = async () => {
    apiProgress = true;
    const { username, email, password } = form
    
    try {
      await signup({ username, email, password });
      signUpSucess = true;
    } catch (error) {
      if(error.response.status === 400) {
        errors = error.response.data.validationErrors;
      }
      apiProgress = false;
    }
  
  }

  const onChange = (event) => {
    const { id, value } = event.target;
    form[id] = value;
    errors[id] = "";
  }

</script>
<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
  {#if !signUpSucess}
    <form class="mt-5" data-testid="form-sign-up">
      <Card>
        <h1 slot="header">{$_("signUp")}</h1>
        <div slot="body">
          <Input id="username" label={$_("username")} help={errors.username} on:input={onChange}/>
          <Input id="email" label={$_("email")} help={errors.email} on:input={onChange} />
          <Input id="password" label={$_("password")} help={errors.password} on:input={onChange} type="password" />
          <Input id="passwordRepeat" label={$_("passwordRepeat")} help={passwordMismatch ? $_("passwordMismatchValidation") : ""} on:input={onChange} type="password" />
          <div class="text-center">
            <ButtonWithProgress {disabled} {apiProgress} onClick={submit}>
              {$_("signUp")}
            </ButtonWithProgress>
          </div>
        </div>
      </Card>
    </form>
  {:else}
    <div class="alert alert-success mt-3">Please check your e-mail to activate your account</div>
  {/if}
</div>