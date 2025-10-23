<script lang="ts">
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	import type { ParticipantModel } from '$lib/entities/participant.js';
	let { onClose, onCancel, onAdd } = $props();
	let firstname = $state('');
	let lastname = $state('');
	let imageUrl = $state('');
	let disabled = $derived(firstname.trim().length <= 0 || lastname.trim().length <= 0);
	function addParticipant() {
		const participant: ParticipantModel = {
			firstname,
			lastname,
			imageUrl,
			id: null,
		}
		onAdd(participant);
	}
</script>
<Modal {onClose} {onCancel} title="Add Participant">
		<form on:submit="{addParticipant}">
			<div>
				<label for="firstname">Firstname:</label>
				<input type="text" id="firstname" bind:value="{firstname}" />
			</div>
			<div>
				<label for="lastname">Lastname:</label>
				<input type="text" id="lastname" bind:value="{lastname}" />
			</div>
			<div>
				<label for="imageUrl">Image URL:</label>
				<input type="text" id="imageUrl" bind:value="{imageUrl}" />
			</div>
			<Button type="submit" mode="peace" {disabled}>Add</Button>
		</form>
	</Modal>