<script lang="ts">
	import Category from '$lib/components/category/Category.svelte';
	import type { CategoryModel } from '$lib/entities/category';
	let { categories=[], onDelete, onEdit }:
		{
			categories: CategoryModel[],
			onDelete: (participant: CategoryModel) => void,
			onEdit: (participant: CategoryModel) => void,
		} = $props();
</script>
<style>
    .grid {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>

<div class="grid">
	{#each categories as category (category.id)}
		<Category {onDelete} {onEdit} {category} />
	{:else}
		<div>No Categories</div>
	{/each}
</div>
