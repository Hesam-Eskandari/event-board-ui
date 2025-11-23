<script>
	import Modal from '../Modal.svelte';
	import Button from '../Button.svelte';
	let { onClose, onCancel, onAdd, title = $bindable(), disabled } = $props();
</script>
<Modal {onClose} {onCancel} title="Add Category">
	<form onsubmit="{onAdd}">
		<div>
			<label for="title">Title:</label>
			<input type="text" id="title" bind:value="{title}" />
		</div>
		<Button type="submit" mode="peace" {disabled}>Add</Button>
	</form>
</Modal>