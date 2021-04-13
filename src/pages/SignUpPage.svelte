<script>
  import { _ } from "svelte-i18n";
  import axios from 'axios';
  import Input from '../components/Input.svelte'

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

  const submit = () => {
    apiProgress = true;
    const { username, email, password } = form
    axios.post('/api/1.0/users', { username, email, password }).then(() => {
      signUpSucess = true;
    }).catch((error) => {
      if(error.response.status === 400) {
        errors = error.response.data.validationErrors;
      }
      apiProgress = false;
    })

  }

  const onChange = (event) => {
    const { id, value } = event.target;
    form[id] = value;
    errors[id] = "";
  }

</script>
<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
  {#if !signUpSucess}
    <form class="card mt-5" data-testid="form-sign-up">
      <div class="card-header">
        <h1 class="text-center">{$_("signUp")}</h1>
      </div>
      <div class="card-body">
        <Input id="username" label={$_("username")} help={errors.username} on:input={onChange}/>
        <Input id="email" label={$_("email")} help={errors.email} on:input={onChange} />
        <Input id="password" label={$_("password")} help={errors.password} on:input={onChange} type="password" />
        <Input id="passwordRepeat" label={$_("passwordRepeat")} help={passwordMismatch ? "Password mismatch" : ""} on:input={onChange} type="password" />
        <div class="text-center">
          <button class="btn btn-primary" disabled={disabled || apiProgress} on:click|preventDefault={submit}>
            {#if apiProgress}
              <span class="spinner-border spinner-border-sm" role="status"></span>
            {/if}
            
            {$_("signUp")}</button>
        </div>
      </div>
    </form>
  {:else}
    <div class="alert alert-success mt-3">Please check your e-mail to activate your account</div>
  {/if}
</div>
