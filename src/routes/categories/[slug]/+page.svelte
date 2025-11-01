<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { page } from '$app/state';
	import type { DataStatus } from '$lib/entities/data-status';
	import type { EventService } from '$lib/services/event.service';
	import { EventStore } from '$lib/store/event.store';
	import type { EventModel } from '$lib/entities/event';
	import ChartDashboard  from '$lib/components/chart-dashboard/ChartDashboard.svelte';
	import type { DashboardItemConfig } from '$lib/entities/dashboard-item';
	import type { CategoryModel } from '$lib/entities/category';
	import type { CategoryService } from '$lib/services/category.service';
	import { CategoryStore } from '$lib/store/category.store';

	const categoryId = $derived(page.params.slug);

	const categoryService: CategoryService = CategoryStore.getInstance();
	const eventService: EventService = EventStore.getInstance();

	let pSub: Unsubscriber | null = null;
	let eSub: Unsubscriber | null = null;
	let category: CategoryModel | null = $state(null);

	let events: EventModel[] = $state([]);
	let categoryEvents: EventModel[] = $derived(events.filter(ev => ev.category.id === categoryId));
	const configs: DashboardItemConfig[] = [
		{
			type: 'pie',
			subtype: 'category-person',
			width: '580px',
			height: '400px',
			id: '1',
			filterConfig: {
				id: '1',
				type: 'dropdown',
				position: 'top-left',
			}
		},
		{
			type: 'pie',
			subtype: 'category-person',
			width: '480px',
			height: '400px',
			id: '2',
			filterConfig: null
		}
	];

	onMount(() => {
		pSub = categoryService.getCategories().subscribe((ds: DataStatus<CategoryModel[]>) => {
			if (ds.status === 'success') {
				const categories = ds.data;
				category = categories.find(c => c.id === categoryId) ?? null
			}
		});
		eSub = eventService.getEvents().subscribe((ds: DataStatus<EventModel[]>) => {
			if (ds.status === 'success') {
				events = ds.data;
			}
		});

	});

	onDestroy(() => {
		pSub?.();
		eSub?.();
	});
</script>

<style>
    .dashboard {
        padding: 50px;
    }
</style>


{#if category !== null}
	<div>Name: {category.title}</div>
{/if}
<div class="dashboard">
	<ChartDashboard events={categoryEvents} {configs}/>
</div>

