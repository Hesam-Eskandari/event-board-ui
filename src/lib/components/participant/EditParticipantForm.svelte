<script lang="ts">
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	import type { ParticipantModel } from '$lib/entities/participant.js';
	let  {
		onClose,
		onCancel,
		onEdit,
		participant
	}: {
		onClose: Function;
		onCancel: Function;
		onEdit: (participant: ParticipantModel) => void;
		participant: ParticipantModel;
	} = $props();
	let firstname = $state(participant.firstname);
	let lastname = $state(participant.lastname);
	let imageUrl = $state(participant.imageUrl);
	let disabled = $derived(firstname.trim().length <= 0 || lastname.trim().length <= 0);
	function editParticipant() {
		onEdit({
			firstname,
			lastname,
			imageUrl,
			id: participant.id
		} as ParticipantModel);
	}

</script>
<Modal {onClose} {onCancel} title="Edit Participant">
		<form on:submit="{editParticipant}">
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
			<Button type="submit" mode="success" {disabled}>Update</Button>
		</form>
	</Modal>