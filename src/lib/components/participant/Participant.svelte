<script lang="ts">
	import Button from '../Button.svelte';
	import { type ParticipantModel } from '$lib/entities/participant';
	let {
		onDelete,
		onEdit,
		participant
	}: {
		onDelete: (p: ParticipantModel) => void;
		onEdit: (p: ParticipantModel) => void;
		participant: ParticipantModel;
	} = $props();


</script>

<style>
	.card {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			justify-content: left;
			width: 100%;
			height: 100%;
			max-width: 300px;
			padding: 1.5rem;
			border: 1px solid #ccc;
			border-radius: 0.5rem;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			margin: 1rem;
			background-color: #EEC
	}

	.img {
			width: 120px;
			height: 120px;
			max-width: 50%;
			max-height: 50%;
			border-radius: 0.5rem;
			object-fit: cover;
	}

	.no-image {
			background-color: #ccc;
			width: 100%;
			height: 100%;
	}

	.content {
			display: flex;
			flex-direction: column;
			margin: 0 1rem;
			max-width: 50%;
			height: 100%;
	}


</style>

<div class="card">
	<div class="img">
		{#if !!participant.imageUrl?.trim().length}
			<img src="{participant.imageUrl}" width="120" alt="{participant.firstname} {participant.lastname}">
		{:else}
			<div class="no-image"></div>
		{/if}
	</div>
	<div class="content">
		<div>{participant.firstname} {participant.lastname}</div>
		<Button type="button" onClick="{() => onEdit(participant)}">Edit</Button>
		<Button type="button" onClick="{() => onDelete(participant)}" mode="danger">Delete</Button>
	</div>
</div>
