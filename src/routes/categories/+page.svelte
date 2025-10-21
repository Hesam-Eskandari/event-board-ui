<script lang="ts">

	import CategoriesGrid from '$lib/components/category/CategoriesGrid.svelte';
	import AddCategoryForm from '$lib/components/category/AddCategoryForm.svelte';
	import EditCategoryForm from '$lib/components/category/EditCategoryForm.svelte';
	import Button from '$lib/components/button.svelte';
	import type { DataStatus } from '$lib/entities/dataStatus';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import type { CategoryModel } from '$lib/entities/category';
	import { CategoryStore } from '$lib/store/category.store';

	const service = CategoryStore.getInstance();
	let subscription: Unsubscriber | null = null;
	let categories: CategoryModel[] = [];
	onMount(() => {
		subscription = service.getCategories().subscribe((model: DataStatus<CategoryModel[]>) => {
			categories = model.data;
		});
	});

	onDestroy(() => {
		subscription?.();
	});

	let showAddForm = false;
	let showEditForm = false;
	let newTitle = '';
	let editTitle = '';
	let editId: string | null = null;

	function isValid(title: string): boolean {
		return title?.trim() !== '';
	}

	function addCategory(event: Event) {
		event.preventDefault();
		if (!isValid(newTitle)) {
			return;
		}
		service.addCategory(newTitle);
		newTitle = '';
		showAddForm = false;
	}

	function toggleAddForm() {
		showAddForm = !showAddForm;
	}

	function toggleEditForm() {
		showEditForm = !showEditForm;
		if (!showEditForm) {
			editTitle = '';
		}
	}

	function editCategoryItem(c: CategoryModel) {
		editTitle = c.title;
		editId = c.id;
		toggleEditForm();
	}

	function onDelete(p: CategoryModel) {
		service.deleteCategory(p);
	}

	function onEdit() {
		if (!isValid(editTitle)) {
			return;
		}
		service.editCategory({title: editTitle, id: editId!});
		editTitle = '';
		editId = '';
		showEditForm = false;
	}
</script>

<style>

</style>

<h1>Categories</h1>

<Button type="button" onClick="{toggleAddForm}" mode="peace">Add</Button>

{#if showAddForm}
	<AddCategoryForm
		onAdd="{addCategory}"
		onCancel="{toggleAddForm}"
		onClose="{toggleAddForm}"
		disabled="{!isValid(newTitle)}"
		bind:title="{newTitle}"
	/>
{/if}

{#if showEditForm}
	<EditCategoryForm
		onClose="{toggleEditForm}"
		onCancel="{toggleEditForm}"
		disabled="{!isValid(editTitle)}"
		onEdit="{onEdit}"
		bind:title="{editTitle}"
	/>
{/if}

<CategoriesGrid {onDelete} onEdit="{editCategoryItem}" {categories} />



