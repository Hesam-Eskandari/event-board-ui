<script lang="ts">
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	import { type EventModel } from '$lib/entities/event';
	import type { CategoryModel } from '$lib/entities/category';
	import type { ParticipantModel } from '$lib/entities/participant';
	let { onClose, onCancel, onAdd, disabled, categories, participants } = $props();
	let title = $state('');
	let startStr = $state('');
	let endStr = $state('');
	let categoryId = $state(categories?.length > 0 ? categories[0].id : '');
	let participantId = $state(participants?.length > 0 ? participants[0].id : '');
	const category = $derived(categories.find((category: CategoryModel) => category.id === categoryId));
	const participant = $derived(participants.find((participant: ParticipantModel) => participant.id === participantId));
	const start = $derived(new Date(startStr));
	const end = $derived(new Date(endStr));

	const isValid = $derived(title.trim().length > 0 && !!category && !!participant && start?.getTime() < end?.getTime());

	function onAddEvent() {
		const event: EventModel = {
			category,
			participant,
			start,
			end,
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
		<div>
			<label for="start">Start:</label>
			<input type="datetime-local" name="start" id="start" bind:value="{startStr}" />
		</div>
		<div>
			<label for="end">End:</label>
			<input type="datetime-local" name="end" id="end" bind:value="{endStr}" />
		</div>
		<Button type="submit" mode="peace" disabled="{!isValid}">Add</Button>
	</form>
</Modal>
