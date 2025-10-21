<script lang="ts">
	import { ParticipantStore } from '$lib/store/participants.store';
	import ParticipantsGrid from '$lib/components/participant/ParticipantsGrid.svelte';
	import AddParticipantForm from '$lib/components/participant/AddParticipantForm.svelte';
	import EditParticipantForm from '$lib/components/participant/EditParticipantForm.svelte';
	import type { ParticipantModel } from '$lib/entities/participant';
	import Button from '$lib/components/button.svelte';
	import type { DataStatus } from '$lib/entities/dataStatus';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	const service = ParticipantStore.getInstance();
	let subscription: Unsubscriber | null = null;
	let participants: ParticipantModel[] = [];
	onMount(() => {
		subscription = service.getParticipants().subscribe((model: DataStatus<ParticipantModel[]>) => {
			participants = model.data;
		});
	});

	onDestroy(() => {
		subscription?.();
	});

	let showAddForm = false;
	let showEditForm = false;
	let newFirstname = '';
	let	newLastname = '';
	let	newImageUrl = '';
	let editFirstname = '';
	let	editLastname = '';
	let	editImageUrl = '';
	let editId: string | null = null;

	function isValid(firstname: string, lastname: string): boolean {
		return firstname?.trim() !== '' && lastname?.trim() !== '';
	}

	function addParticipant(event: Event) {
		event.preventDefault();
		if (!isValid(newFirstname, newLastname)) {
			return;
		}
		service.addParticipant(newFirstname, newLastname, newImageUrl);
		newFirstname = '';
		newLastname = '';
		newImageUrl = '';
		showAddForm = false;
	}

	function toggleAddForm() {
		showAddForm = !showAddForm;
	}

	function toggleEditForm() {
		showEditForm = !showEditForm;
		if (!showEditForm) {
			editFirstname = '';
			editLastname = '';
			editImageUrl = '';
		}
	}

	function editParticipantItem(p: ParticipantModel) {
		editFirstname = p.firstname;
		editLastname = p.lastname;
		editImageUrl = p.imageUrl;
		editId = p.id;
		toggleEditForm();
	}

	function onDelete(p: ParticipantModel) {
		service.deleteParticipant(p);
	}

	function onEdit() {
		if (!isValid(editFirstname, editLastname)) {
			return;
		}
		service.editParticipant({firstname: editFirstname, lastname: editLastname, imageUrl: editImageUrl, id: editId!});
		editFirstname = '';
		editLastname = '';
		editImageUrl = '';
		editId = '';
		showEditForm = false;
	}
</script>

<style>

</style>

<h1>
	Participants
</h1>

<Button type="button" onClick="{toggleAddForm}" mode="peace">Add</Button>

{#if showAddForm}
	<AddParticipantForm
		onAdd="{addParticipant}"
		onCancel="{toggleAddForm}"
		onClose="{toggleAddForm}"
		disabled="{!isValid(newFirstname, newLastname)}"
		bind:firstname="{newFirstname}"
		bind:lastname="{newLastname}"
		bind:imageUrl="{newImageUrl}"
	/>
{/if}

{#if showEditForm}
	<EditParticipantForm
		onClose="{toggleEditForm}"
		onCancel="{toggleEditForm}"
		disabled="{!isValid(editFirstname, editLastname)}"
		onEdit="{onEdit}"
		bind:firstname="{editFirstname}"
		bind:lastname="{editLastname}"
		bind:imageUrl="{editImageUrl}"
	/>
{/if}

<ParticipantsGrid {onDelete} onEdit="{editParticipantItem}" {participants}></ParticipantsGrid>



