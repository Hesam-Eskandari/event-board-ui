<script>
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	let  { onClose, onCancel, onEdit, title = $bindable(), disabled} = $props();

</script>
<Modal {onClose} {onCancel} title="Edit Category">
	<form on:submit="{onEdit}">
		<div>
			<label for="title">Title:</label>
			<input type="text" id="title" bind:value="{title}" />
		</div>
		<Button type="submit" mode="success" {disabled}>Update</Button>
	</form>
</Modal>