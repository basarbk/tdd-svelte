<script>
	import SignUpPage from './pages/SignUpPage.svelte';
	import LanguageSelector from './components/LanguageSelector.svelte';
	import HomePage from "./pages/HomePage.svelte";
	import LoginPage from "./pages/LoginPage.svelte";
	import UserPage from "./pages/UserPage.svelte";
	import { _ } from "svelte-i18n";

	let path = window.location.pathname;

	const onClickNavBar = (event) => {
		path = event.currentTarget.attributes.href.value;
		window.history.pushState({}, "", path);
	}

</script>

<div class="bg-light shadow-sm">
	<nav class="navbar navbar-expand container navbar-light">
		<a class="navbar-brand" href="/" title="Home" on:click|preventDefault={onClickNavBar}>
			<img src="/assets/hoaxify.png" alt="Hoaxify" width="60"/>
			
			Hoaxify</a>

		<ul class="navbar-nav ml-auto">
			<a class="nav-link" href="/signup" on:click|preventDefault={onClickNavBar}>{$_("signUp")}</a>
			<a class="nav-link" href="/login" on:click|preventDefault={onClickNavBar}>Login</a>
		</ul>
	</nav>
</div>
<div class="container">
	{#if path === "/"}
		<HomePage />
	{:else if path === "/signup"}
		<SignUpPage />
	{:else if path === "/login"}
		<LoginPage />
	{:else if path.startsWith("/user")}
		<UserPage />
	{/if}
	<LanguageSelector />
</div>
