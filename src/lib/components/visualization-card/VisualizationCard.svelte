<script lang="ts">
	import type { EventModel } from '$lib/entities/event';
	import type { FilterConfig } from '$lib/entities/filter-config';
	import type { Period } from '$lib/entities/period';
	import PeriodDropdown from '$lib/components/period-dropdown/PeriodDropdown.svelte';
	import { type Snippet } from 'svelte';
	import { Styling } from '$lib/utils/styling';

	let {
		filterConfig,
		events,
		onFilter,
		children
	}: {
		filterConfig: FilterConfig | null,
		events: EventModel[],
		onFilter: (events: EventModel[], p:Period) => void,
		children: Snippet,
	} = $props();

	let isEmittedEventsForNullFilters: boolean = false;
	let filterStyling = $derived(filterConfig === null ? "" : Styling.ConvertStyleToString(Styling.getStylingForPosition(filterConfig.position)));

	function isEventOverlappingPeriod(event: EventModel, period: Period) {
		return (event.end.getTime() > period.duration.start.getTime() && event.end.getTime() < period.duration.end.getTime()) ||
			(event.start.getTime() > period.duration.start.getTime() && event.start.getTime() < period.duration.end.getTime());
	}

	function filterEvents(p: Period) {
		onFilter(events.filter(event => isEventOverlappingPeriod(event, p)), p);
	}

	$effect(() => {
		if (filterConfig === null && events.length > 0 && !isEmittedEventsForNullFilters) {
			isEmittedEventsForNullFilters = true;
			const minStart = new Date(Math.min(...events.map(duration => duration.start.getTime())));
			const maxEnd = new Date(Math.max(...events.map(duration => duration.end.getTime())));
			onFilter(events, {id: Math.random().toString(36), name: 'Inclusive', duration: {start: minStart, end: maxEnd}});
		}
	});

</script>

<style>
    .visualization-card {
        display: block;
        min-width: 250px;
        min-height: 150px;
				width: 100%;
				height: 100%;
        background-color: #fafafa !important;
        border: 1px solid #ccc !important;
        border-radius: 15px;
				z-index: 1;
				position: relative;
    }
		.content {
        box-sizing: border-box;
        padding: 15px;
				width: 100%;
				height: 100%;
		}
		.dropdown {
				z-index: 1;
		}
</style>

<section class="visualization-card">
	<div class="content">
		{#if filterConfig?.type === 'dropdown'}
			<div class="dropdown" style="{filterStyling}">
				<PeriodDropdown onSelect={filterEvents} />
			</div>
		{/if}
		<div style="z-index: 0; width: 100%; height: 100%;">
			{@render children()}
		</div>

	</div>
</section>
