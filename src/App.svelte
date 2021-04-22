<script>
	import SignUpPage from './pages/SignUpPage.svelte';
	import LanguageSelector from './components/LanguageSelector.svelte';
	import HomePage from "./pages/HomePage.svelte";
	import LoginPage from "./pages/LoginPage.svelte";
	import UserPage from "./pages/UserPage.svelte";
	import AccountActivationPage from "./pages/AccountActivationPage.svelte";
	import { _ } from "svelte-i18n";
	import { Router, Route } from "svelte-routing";
	import NavBar from "./components/NavBar.svelte";

</script>

<Router url={window.location.pathname}>
	<NavBar />
	<div class="container">
		<Route path="/">
			<HomePage />
		</Route>
		<Route path="/signup">
			<SignUpPage />
		</Route>
		<Route path="/login">
			<LoginPage />
		</Route>
		<Route path="/user/:id" let:params>
			<UserPage id={params.id}/>
		</Route>
		<Route path="/activate/:token" let:params>
			<AccountActivationPage token={params.token}/>
		</Route>
		<LanguageSelector />
	</div>
</Router>
