<script lang="ts">
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	import { type EventModel } from '$lib/entities/event';
	import type { CategoryModel } from '$lib/entities/category';
	import type { ParticipantModel } from '$lib/entities/participant';
	let { onClose, onCancel, onEdit, categories, participants, event } = $props();
	let title = $state(event.title);
	let categoryId = $state(event.category.id);
	let participantId = $state(event.participant.id);
	const category = $derived(categories.find((category: CategoryModel) => category.id === categoryId));
	const participant = $derived(participants.find((participant: ParticipantModel) => participant.id === participantId));
	const isValid = $derived(category.id !== event.category.id || participant.id !== event.participant.id || title !== event.title);

	function onEditEvent() {
		const eventNew: EventModel = {
			...event,
			category,
			participant,
			start: new Date(),
			end: new Date(
				new Date().setHours(
					new Date().getHours() + 1
				)
			),
			title,
		};
		onEdit(eventNew);
	}
</script>
<Modal {onClose} {onCancel} title="Add Event">
	<form on:submit="{onEditEvent}">
		<div>
			<label for="title">Title:</label>
			<input type="text" name="title" id="title" bind:value="{title}" />
		</div>
		<div>
			<label for="category">Category:</label>
			<select bind:value="{categoryId}">
				{#each categories as category}
					<option value="{category.id}">{category.title}</option>
				{:else}
					<option value="No Category">No category found</option>
				{/each}/}
			</select>
		</div>
		<div>
			<label for="participant">Participant:</label>
			<select bind:value="{participantId}">
				{#each participants as participant}
					<option value="{participant.id}">{participant.firstname} {participant.lastname}</option>
				{:else}
					<option value="No Participant">No participant found</option>
				{/each}/}
			</select>
		</div>
		<Button type="submit" mode="success" disabled="{!isValid}">Update</Button>
	</form>
</Modal>
