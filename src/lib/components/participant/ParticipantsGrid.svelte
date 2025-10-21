<script lang="ts">
	import Participant from '$lib/components/participant/Participant.svelte';
	import type { ParticipantModel } from '$lib/entities/participant';
	let { participants=[], onDelete, onEdit }:
		{
			participants: ParticipantModel[],
			onDelete: (participant: ParticipantModel) => void,
			onEdit: (participant: ParticipantModel) => void,
	} = $props();
</script>
<style>
    .grid {
        display: flex;
        max-width: 100%;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>

<div class="grid">
	{#each participants as participant (participant.id)}
		<Participant {onDelete} {onEdit} {participant} />
	{:else}
		<div>No Participants</div>
	{/each}
</div>
