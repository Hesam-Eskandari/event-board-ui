<script lang="ts">
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';

let {
	onClose,
	onCancel,
	onCreate }: {
	onClose: () => void;
	onCancel: () => void;
	onCreate: (tag: string) => void;
} = $props();

let tag = $state('');
let disabled = $derived(tag.trim().length < 3);

function onCreateWorkspace() {
	onCreate(tag);
}

</script>

<Modal {onClose} {onCancel} title="Create A Workspace">
	<form onsubmit="{onCreateWorkspace}">
		<div>
			<label for="title">Choose a name for your workspace:</label>
			<input type="text" id="title" bind:value="{tag}" />
		</div>
		<Button type="submit" mode="peace" {disabled}>Create</Button>
	</form>
</Modal>