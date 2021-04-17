<script>
	import SignUpPage from './pages/SignUpPage.svelte';
	import LanguageSelector from './components/LanguageSelector.svelte';
	import HomePage from "./pages/HomePage.svelte";
	import LoginPage from "./pages/LoginPage.svelte";
	import UserPage from "./pages/UserPage.svelte";
	import { _ } from "svelte-i18n";

	let path = window.location.pathname;

	const onClickNavBar = (event) => {
		path = event.target.attributes.href.value;
		window.history.pushState({}, "", path);
	}

</script>

<div class="container">
	<div>
		<a href="/" title="Home" on:click|preventDefault={onClickNavBar}>Hoaxify</a>
		<a href="/signup" on:click|preventDefault={onClickNavBar}>{$_("signUp")}</a>
		<a href="/login" on:click|preventDefault={onClickNavBar}>Login</a>
	</div>
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
