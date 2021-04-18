<script>
	import SignUpPage from './pages/SignUpPage.svelte';
	import LanguageSelector from './components/LanguageSelector.svelte';
	import HomePage from "./pages/HomePage.svelte";
	import LoginPage from "./pages/LoginPage.svelte";
	import UserPage from "./pages/UserPage.svelte";
	import AccountActivationPage from "./pages/AccountActivationPage.svelte";
	import { _ } from "svelte-i18n";
	import { Router, Route, Link} from "svelte-routing";

</script>

<Router url={window.location.pathname}>
	<div class="bg-light shadow-sm">
		<nav class="navbar navbar-expand container navbar-light">
			<Link class="navbar-brand" to="/" title="Home">
				<img src="/assets/hoaxify.png" alt="Hoaxify" width="60"/>
				Hoaxify
			</Link>
	
			<ul class="navbar-nav ml-auto">
				<Link class="nav-link" to="/signup">{$_("signUp")}</Link>
				<Link class="nav-link" to="/login">Login</Link>
			</ul>
		</nav>
	</div>
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
