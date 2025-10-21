<script lang="ts">
	import Button from '../Button.svelte';
	import { type EventModel } from '$lib/entities/event';
	let {
		onDelete,
		onEdit,
		event
	}:
	{
		onDelete: (ev: EventModel) => void;
		onEdit: (ev: EventModel) => void;
		event: EventModel;

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

    .content {
        display: flex;
        flex-direction: column;
        margin: 0 1rem;
        max-width: 50%;
        height: 100%;
    }


</style>

<div class="card">
	<div class="content">
		<div>{event.title}</div>
		<div>Participant: {event.participant.firstname} {event.participant.lastname}</div>
		<div>Category: {event.category.title}</div>
		<Button type="button" onClick="{() => onEdit(event)}">Edit</Button>
		<Button type="button" onClick="{() => onDelete(event)}" mode="danger">Delete</Button>
	</div>
</div>
