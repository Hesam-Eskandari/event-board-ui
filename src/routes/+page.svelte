<script lang="ts">
	import { page } from "$app/state";
	import { goto } from '$app/navigation';
	import Button from "$lib/components/Button.svelte";
	import { TenantStore } from '$lib/store/tenant.store.js';
	import type { DataStatus } from '$lib/entities/data-status';
	import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';
	import { onMount } from 'svelte';
	import LoadWorkspace from "$lib/components/workspace/LoadWorkspace.svelte";
	import ExitWorkspace from "$lib/components/workspace/ExitWorkspace.svelte";
	import CreateWorkspace from "$lib/components/workspace/CreateWorkspace.svelte";
	import SaveToLocalStorage from "$lib/components/workspace/SaveToLocalStorage.svelte";
	import LocalStorageOverride from "$lib/components/workspace/LocalStorageOverride.svelte";
	import { LocalStorageService } from '$lib/services/local-storage/localStorage.service';

	const tenantService = TenantStore.getInstance();
	let tenant: TenantModel | null = $state(null);
	let showLoadModal = $state(false);
	let showCreateModal = $state(false);
	let showExitModal = $state(false);
	let showSaveToLocalStorageModal = $state(false);
	let showOverrideLocalStorageModal = $state(false);
	let message: { welcome: string; status: string; } = $state({ welcome: '', status: '' });

	onMount(() => {
		const token = TokenSnapshotStore.getToken();
		if (token != null) {
			loadTenant(token);
		}
	});

	function createTenant() {
		tenantService.createTenant().subscribe((ds: DataStatus<TenantModel | null>) => {
			showLoadModal = false;
			showCreateModal = false;
			if (ds.status === 'success') {
				TokenSnapshotStore.saveToken(ds.data!.adminToken);
				tenant = ds.data!;
				if (tenant?.adminToken != null) {
					const newUrl = new URL(page.url);
					newUrl.searchParams.set('token', tenant.adminToken);
					message.status = 'Workspace created successfully';
					message.welcome = `Welcome to the "${tenant.tag}" workspace`;
					goto(newUrl.toString(), { keepFocus: true, noScroll: true });
				}
			}
		});
	}

	function loadTenant(token: string) {
		tenantService.getTenant(token).subscribe((ds: DataStatus<TenantModel | null>) => {
			showLoadModal = false;
			showCreateModal = false;
			if (ds.status === 'success') {
				tenant = ds.data!;
				message.status = 'Workspace loaded successfully';
				message.welcome = `Welcome back to the "${tenant.tag}" workspace`;
			}

		});
	}

	function exitWorkspace() {
		tenant = null;
		TokenSnapshotStore.saveToken(null);
		toggleExitModal();
		goto('/', { keepFocus: true, noScroll: true });
	}

	function toggleLoadModal() {
		showLoadModal = !showLoadModal;
	}

	function toggleExitModal() {
		showExitModal = !showExitModal;
	}

	function toggleCreateModel() {
		showCreateModal = !showCreateModal;
	}

	function toggleSaveToLocalStorageModal() {
		showSaveToLocalStorageModal = !showSaveToLocalStorageModal;
	}

	function toggleOverrideLocalStorageModal() {
		showOverrideLocalStorageModal = !showOverrideLocalStorageModal;
	}

	function saveToLocalStorage() {
		showSaveToLocalStorageModal = false;
		if (tenant == null) {
			return;
		}
		const [_, err] = LocalStorageService.getWorkspace(tenant.tag);
		if (err == null) {
			showOverrideLocalStorageModal = true;
		} else {
			forceSaveToLocalStorage();
		}
	}

	function forceSaveToLocalStorage() {
		if (tenant == null) {
			return;
		}
		showOverrideLocalStorageModal = false;
		LocalStorageService.saveWorkspace(tenant)
	}

	function downloadAsFile() {

	}
</script>

<style>
	.row {
			padding: 5px 10px;
			display: flex;
			align-items: center;
	}
	.item {
			padding: 10px;
	}
  .card {
      width: 100%;
      height: 100%;
      max-width: 400px;
      padding: 1rem 1.5rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin: 1rem;
      background-color: #EEC;
  }
</style>

{#if tenant == null}
	<div class="card">
		<h3>I'm already a tenant</h3>
		<div class="row">
			<div class="item">Load my existing workspace</div>
			<div class="item">
				<Button type="button" onClick={toggleLoadModal} mode="success">Load Tenant</Button>
			</div>
			{#if showLoadModal}
				<LoadWorkspace onClose={toggleLoadModal} onCancel={toggleLoadModal} onLoad={loadTenant} />
			{/if}
		</div>
	</div>
	<div class="card">
		<h3>Become a new tenant</h3>
		<div class="row">
			<div class="item">Create a new workspace</div>
			<div class="item">
				<Button type="button" mode="peace" onClick={toggleCreateModel}>Create a tenant</Button>
			</div>
		</div>
	</div>
	{#if showCreateModal}
		<CreateWorkspace onClose={toggleCreateModel} onCancel={toggleCreateModel} onCreate={createTenant} />
	{/if}
{:else }
	<div class="card">
		<h3>{message.welcome}</h3>
		<div class="item">{message.status}</div>
	</div>

	<div class="card">
		<h3>Save Your Workspace ID</h3>
		<div>Save a record of your workspace ID before leaving. You will need it to rejoin this workspace later.</div>
		{#if showSaveToLocalStorageModal}
			<SaveToLocalStorage
				onClose={toggleSaveToLocalStorageModal}
				onCancel={toggleSaveToLocalStorageModal}
				onSave={saveToLocalStorage}/>
		{/if}
		{#if showOverrideLocalStorageModal}
			<LocalStorageOverride
				tag={tenant.tag}
				onClose={toggleOverrideLocalStorageModal}
				onCancel={toggleOverrideLocalStorageModal}
				onSave={forceSaveToLocalStorage} />
		{/if}
		<Button type="button" mode="success" onClick={toggleSaveToLocalStorageModal}>Save in this browser</Button>
		<Button type="button" mode="success" onClick={downloadAsFile}>Download as a file</Button>
	</div>

	<div class="card">
		<div class="row">
			<div class="item">Exit workspace</div>
			<div class="item">
				<Button type="button" mode="danger" onClick={toggleExitModal}>Exit</Button>
			</div>
		</div>
	</div>
	{#if showExitModal}
		<ExitWorkspace onClose={toggleExitModal} onCancel={toggleExitModal} onExit={exitWorkspace} />
	{/if}
{/if}




