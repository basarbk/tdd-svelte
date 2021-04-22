<script>
	import { _ } from "svelte-i18n";
	import { Link} from "svelte-routing";
	import { auth } from "../store/stores";

	let isLoggedIn = false;
	let loggedInUserId;

	auth.subscribe((authState) => {
		isLoggedIn = authState.isLoggedIn;
		loggedInUserId = authState.id;
	})

</script>
<div class="bg-light shadow-sm mb-3">
  <nav class="navbar navbar-expand container navbar-light">
    <Link class="navbar-brand" to="/" title="Home">
      <img src="/assets/hoaxify.png" alt="Hoaxify" width="60"/>
      Hoaxify
    </Link>

    <ul class="navbar-nav ml-auto">
      {#if !isLoggedIn}
        <Link class="nav-link" to="/signup">{$_("signUp")}</Link>
        <Link class="nav-link" to="/login">Login</Link>
      {:else}
        <Link class="nav-link" to={`/user/${loggedInUserId}`}>My Profile</Link>
      {/if}
    </ul>
  </nav>
</div>