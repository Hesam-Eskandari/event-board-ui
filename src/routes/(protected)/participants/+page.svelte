<script lang="ts">
	import type { Unsubscriber } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ParticipantStore } from '$lib/store/participants.store';
	import ParticipantsGrid from '$lib/components/participant/ParticipantsGrid.svelte';
	import AddParticipantForm from '$lib/components/participant/AddParticipantForm.svelte';
	import EditParticipantForm from '$lib/components/participant/EditParticipantForm.svelte';
	import type { ParticipantModel } from '$lib/entities/participant';
	import Button from '$lib/components/Button.svelte';
	import type { DataStatus } from '$lib/entities/data-status';
	import { page } from '$app/state';

	const service = ParticipantStore.getInstance();
	let subscription: Unsubscriber | null = null;
	let participants: ParticipantModel[] = $state([]);
	onMount(() => {
		subscription = service.getParticipants().subscribe((model: DataStatus<ParticipantModel[]>) => {
			participants = model.data;
		});
	});

	onDestroy(() => {
		subscription?.();
	});

	let showAddForm = $state(false);
	let showEditForm = $state(false);
	let editParticipant: ParticipantModel | null = $state(null);

	function isValid(firstname: string, lastname: string): boolean {
		return firstname?.trim() !== '' && lastname?.trim() !== '';
	}

	function addParticipant(participant: ParticipantModel) {
		if (!isValid(participant.firstname, participant.lastname)) {
			return;
		}
		service.addParticipant(participant);
		showAddForm = false;
	}

	function toggleAddForm() {
		showAddForm = !showAddForm;
	}

	function toggleEditForm() {
		showEditForm = !showEditForm;
		if (!showEditForm) {
			editParticipant = null;
		}
	}

	function editParticipantItem(p: ParticipantModel) {
		editParticipant = p;
		toggleEditForm();
	}

	function onDelete(p: ParticipantModel) {
		service.deleteParticipant(p);
	}

	function onEdit(p: ParticipantModel) {
		if (!isValid(p.firstname, p.lastname)) {
			return;
		}
		service.editParticipant(p);
		toggleEditForm()
	}

	function buildUrl(path: string) {
		const url = new URL(page.url);
		url.pathname = path;
		return url.toString();
	}

	function onSelect(id: string) {
		console.log('navigate to par it');
		goto(buildUrl(`/participants/${id}`));
	}
</script>

<style>

</style>

<h1>
	Participants
</h1>

<Button type="button" onClick={toggleAddForm} mode="peace">Add</Button>

{#if showAddForm}
	<AddParticipantForm
		onAdd={addParticipant}
		onCancel={toggleAddForm}
		onClose={toggleAddForm}
	/>
{/if}

{#if showEditForm && editParticipant !== null}
	<EditParticipantForm
		onClose={toggleEditForm}
		onCancel={toggleEditForm}
		onEdit={onEdit}
		participant={editParticipant}
	/>
{/if}

<ParticipantsGrid {onDelete} onEdit={editParticipantItem} {participants} {onSelect}></ParticipantsGrid>



