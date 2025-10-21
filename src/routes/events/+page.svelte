<script lang="ts">
	import { ParticipantStore } from '$lib/store/participants.store';
	import AddEventForm from '$lib/components/event/AddEventForm.svelte';
	import EventsGrid from '$lib/components/event/EventsGrid.svelte';
	import type { ParticipantModel } from '$lib/entities/participant';
	import Button from '$lib/components/button.svelte';
	import type { DataStatus } from '$lib/entities/dataStatus';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { EventModel } from '$lib/entities/event';
	import { CategoryStore } from '$lib/store/category.store';
	import type { CategoryModel } from '$lib/entities/category';
	import { EventStore } from '$lib/store/event.store';
	import EditEventForm from '$lib/components/event/EditEventForm.svelte';

	const participantService = ParticipantStore.getInstance();
	const categoryService = CategoryStore.getInstance();
	const eventService = EventStore.getInstance();
	let pSub: Unsubscriber | null = null;
	let cSub: Unsubscriber | null = null;
	let eSub: Unsubscriber | null = null;
	let participants: ParticipantModel[] = [];
	let categories: CategoryModel[] = [];
	let events: EventModel[] = [];

	onMount(() => {
		pSub = participantService.getParticipants().subscribe((model: DataStatus<ParticipantModel[]>) => {
			participants = model.data;
		});
		cSub = categoryService.getCategories().subscribe((model: DataStatus<CategoryModel[]>) => {
			categories = model.data;
		});
		eSub = eventService.getEvents().subscribe((model: DataStatus<EventModel[]>) => {
			events = model.data;
		})
	});

	onDestroy(() => {
		pSub?.();
		cSub?.();
		eSub?.();
	});

	let showAddForm = false;
	let showEditForm = false;
	let editEvent: EventModel | null = null;

	function isValid(): boolean {
		return true;
	}

	function addEvent(event: EventModel) {
		eventService.addEvent(event);
		toggleAddForm();
	}

	function toggleAddForm() {
		showAddForm = !showAddForm;
	}

	function toggleEditForm() {
		showEditForm = !showEditForm;
		if (!showEditForm) {
			editEvent = null;
		}
	}

	function editEventItem(e: EventModel) {
		editEvent = e;
		toggleEditForm();
	}

	function onDelete(p: EventModel) {
		eventService.deleteEvent(p);
	}

	function onEdit(event: EventModel) {
		if (!isValid()) {
			return;
		}
		eventService.editEvent(event);
		editEvent = null;
		showEditForm = false;
	}
</script>

<style>

</style>

<h1>
	Events
</h1>

<Button type="button" onClick="{toggleAddForm}" mode="peace">Add</Button>

{#if showAddForm}
	<AddEventForm
		onAdd="{addEvent}"
		onCancel="{toggleAddForm}"
		onClose="{toggleAddForm}"
		disabled="{!isValid()}"
		{categories}
		{participants}
	/>
{/if}

{#if showEditForm}
	<EditEventForm
		onEdit="{onEdit}"
		onCancel="{toggleEditForm}"
		onClose="{toggleEditForm}"
		{categories}
		{participants}
		event="{editEvent}"
	/>
{/if}

<EventsGrid {onDelete} onEdit="{editEventItem}" {events}></EventsGrid>



