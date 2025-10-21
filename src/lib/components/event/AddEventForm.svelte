<script lang="ts">
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	import { type EventModel } from '$lib/entities/event';
	import type { CategoryModel } from '$lib/entities/category';
	import type { ParticipantModel } from '$lib/entities/participant';
	let { onClose, onCancel, onAdd, disabled, categories, participants } = $props();
	let title = '';
	let categoryId = categories?.length > 0 ? categories[0].id : '';
	let participantId = participants?.length > 0 ? participants[0].id : '';

	function onAddEvent() {
		const event: EventModel = {
			category: categories.find((category: CategoryModel) => category.id === categoryId),
			participant: participants.find((participant: ParticipantModel) => participant.id === participantId),
			start: new Date(),
			end: new Date(
				new Date().setHours(
					new Date().getHours() + 1
				)
			),
			title,
			id: null
		};
		onAdd(event);
	}
</script>
<Modal {onClose} {onCancel} title="Add Event">
	<form on:submit="{onAddEvent}">
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
		<Button type="submit" mode="peace" {disabled}>Add</Button>
	</form>
</Modal>
