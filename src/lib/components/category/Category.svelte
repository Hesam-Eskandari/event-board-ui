<script lang="ts">
	import Button from '../Button.svelte';
	import { type CategoryModel } from '$lib/entities/category';
	let {
		onDelete,
		onEdit,
		category
	}: {
		onDelete: (category: CategoryModel) => void;
		onEdit: (category: CategoryModel) => void;
		category: CategoryModel;
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
		<div>{category.title}</div>
		<div>
			<Button type="button" onClick="{() => onEdit(category)}">Edit</Button>
			<Button type="button" onClick="{() => onDelete(category)}" mode="danger">Delete</Button>
		</div>
	</div>
</div>
