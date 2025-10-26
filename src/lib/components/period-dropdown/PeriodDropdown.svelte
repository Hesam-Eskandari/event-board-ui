<script lang="ts">
	import { DateTimeHelper } from '$lib/utils/dateTime';
	import type { Period } from '$lib/entities/period';
	import { onMount } from 'svelte';

	let {
		initialPeriodId=null,
		onSelect
	}: {
		initialPeriodId?: string | null;
		onSelect: (period: Period) => void;
	} = $props();
	const periods: Period[] = DateTimeHelper.buildPeriods();
	let periodId = $derived(initialPeriodId ?? periods.length ? periods[0].id : null);
	let invalidOptionSet = $derived(periodId === null);

	onMount(() => {
		selectOption();
	});

	function selectOption() {
		if (periodId === null) {
			return;
		}
		const period = periods.find((p) => p.id === periodId) ?? null;
		if (period === null) {
			return;
		}
		onSelect(period);
	}
</script>

<style>
	select {
			display: block;
			width: max-content;
			min-width: 100px;
			border: 1px solid #bcc;
			border-radius: 4px;
			font-size: 1rem;
			background-color: #fafaff;
			color: #222;
			cursor: pointer;
			appearance: none;
			padding: 10px;
      box-shadow: 0 0 4px #007bff, 0 0 8px #dcaaaa;
      text-align: center;
	}
	select:focus {
			outline: none;
			border-color: #00aaff;
	}
	select:hover {
			border-color: #0099ff;
      box-shadow: 0 0 6px #0055aa, 0 0 10px #faa;
	}
</style>

{#if invalidOptionSet}
	<p>Invalid Dropdown Options</p>
{:else}
	<select bind:value={periodId} on:change={selectOption}>
		{#each periods as period}
			<option class="item" value={period.id}>{period.name}</option>
		{/each}
	</select>
{/if}