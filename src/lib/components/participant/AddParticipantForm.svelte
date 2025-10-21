<script>
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	let { onClose, onCancel, onAdd, firstname = $bindable(), lastname = $bindable(), imageUrl = $bindable(), disabled } = $props();
</script>
<Modal {onClose} {onCancel} title="Add Participant">
		<form on:submit="{onAdd}">
			<div>
				<label for="firstname">Firstname:</label>
				<input type="text" id="firstname" bind:value="{firstname}" />
			</div>
			<div>
				<label for="lastname">Lastname:</label>
				<input type="text" id="lastname" bind:value="{lastname}" />
			</div>
			<div>
				<label for="imageUrl">Image URL:</label>
				<input type="text" id="imageUrl" bind:value="{imageUrl}" />
			</div>
			<Button type="submit" mode="peace" {disabled}>Add</Button>
		</form>
	</Modal>