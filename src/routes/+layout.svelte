<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';

	const token = page.url.searchParams.get('token');
	TokenSnapshotStore.saveToken(token);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/participants">Participants</a>
	<a href="/categories">Categories</a>
	<a href="/events">Events</a>
</nav>

{@render children?.()}
