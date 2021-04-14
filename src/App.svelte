<script>
	import SignUpPage from './pages/SignUpPage.svelte';
	import LanguageSelector from './components/LanguageSelector.svelte';
	import HomePage from "./pages/HomePage.svelte";
	import LoginPage from "./pages/LoginPage.svelte";
	import UserPage from "./pages/UserPage.svelte";

	let path = window.location.pathname;
</script>

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
