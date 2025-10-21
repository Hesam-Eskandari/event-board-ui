<script>
	import Modal from '../modal.svelte';
	import Button from '../Button.svelte';
	let  { onClose, onCancel, onEdit, firstname = $bindable(), lastname = $bindable(), imageUrl = $bindable(), disabled} = $props();

</script>
<Modal {onClose} {onCancel} title="Edit Participant">
		<form on:submit="{onEdit}">
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
			<Button type="submit" mode="success" {disabled}>Update</Button>
		</form>
	</Modal>