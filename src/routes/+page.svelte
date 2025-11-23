<script lang="ts">
	import { page } from "$app/state";
	import { goto } from '$app/navigation';
	import Button from "$lib/components/Button.svelte";
	import { TenantStore } from '$lib/store/tenant.store.js';
	import type { DataStatus } from '$lib/entities/data-status';
	import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';
	import { onMount } from 'svelte';
	import LoadTenant from "$lib/components/tenant/LoadTenant.svelte";

	const tenantService = TenantStore.getInstance();
	let tenant: TenantModel | null = $state(null);
	let showLoadModal = $state(false);
	let message = $state('');

	onMount(() => {
		const token = TokenSnapshotStore.getToken();
		if (token != null) {
			loadTenant(token);
		}
	});

	function createTenant() {
		tenantService.createTenant().subscribe((ds: DataStatus<TenantModel | null>) => {
			showLoadModal = false;
			if (ds.status === 'success') {
				TokenSnapshotStore.saveToken(ds.data!.adminToken);
				tenant = ds.data!;
				if (tenant?.adminToken != null) {
					const newUrl = new URL(page.url);
					newUrl.searchParams.set('token', tenant.adminToken);
					message = 'Workspace created successfully';
					goto(newUrl.toString(), { keepFocus: true, noScroll: true });
				}
			}
		});
	}

	function loadTenant(token: string) {
		tenantService.getTenant(token).subscribe((ds: DataStatus<TenantModel | null>) => {
			showLoadModal = false;
			if (ds.status === 'success') {
				tenant = ds.data!;
				message = 'Workspace loaded successfully';
			}

		});
	}

	function exitWorkspace() {
		tenant = null;
		TokenSnapshotStore.saveToken(null);
		goto('/', { keepFocus: true, noScroll: true })
	}

	function toggleLoadModal() {
		showLoadModal = !showLoadModal;
	}
</script>

<style>
	.row {
			padding: 10px;
			display: flex;
			align-items: center;
	}
	.item {
			padding: 10px;
	}
</style>

{#if tenant == null}
	<div class="row">
		<div class="item">Load my existing workspace</div>
		<div class="item">
			<Button type="button" onClick={toggleLoadModal} mode="peace">Load Tenant</Button>
		</div>
		{#if showLoadModal}
			<LoadTenant onClose={toggleLoadModal} onCancel={toggleLoadModal} onLoad={loadTenant} />
		{/if}
	</div>
	<div class="row">
		<div class="item">Create a new workspace</div>
		<div class="item">
			<Button type="button" mode="peace" onClick={createTenant}>Create a tenant</Button>
		</div>
	</div>
{:else }
	<div class="item">{message}</div>
	<div class="row">
		<div class="item">Exit workspace</div>
		<div class="item">
			<Button type="button" mode="danger" onClick={exitWorkspace}>Exit</Button>
		</div>
	</div>
{/if}




