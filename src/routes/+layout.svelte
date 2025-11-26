<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { DataStatus } from '$lib/entities/data-status';
	import { TenantStore } from '$lib/store/tenant.store';
	import { onMount } from 'svelte';
	import { TokenStore } from '$lib/store/token.store';

	let { children } = $props();
	const tenantService = TenantStore.getInstance();
	const tokenStore = TokenStore.getInstance();
	let tenant: TenantModel | null = $state(null);

	onMount(() => {
		loadTenant();
	});



	function loadTenant(token?: string) {
		tenantService.getTenant(token).subscribe((ds: DataStatus<TenantModel | null>) => {
			tenant = ds.status === 'success' ? ds.data! : null;
			console.log('tenant', tenant);
		});
	}

	function buildUrl(path: string) {
		const url = new URL(page.url);
		url.pathname = path;
		return url.toString();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="{buildUrl('/')}">Home</a>
	{#if tenant != null}
		<a href="{buildUrl('/participants')}">Participants</a>
		<a href="{buildUrl('/categories')}">Categories</a>
		<a href="{buildUrl('/events')}">Events</a>
	{/if}
</nav>

{@render children?.()}
