<script lang="ts">
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';

let {
	onClose,
	onCancel,
	onLoad }: {
	onClose: () => void;
	onCancel: () => void;
	onLoad: (token: string) => void;
} = $props();


let token = $state('');
let disabled = $derived(token.trim().length === 0);

function onLoadWorkspace() {
	onLoad(token);
}

</script>

<Modal {onClose} {onCancel} title="Load Workspace">
	<form onsubmit="{onLoadWorkspace}">
		<div>
			<label for="title">Token:</label>
			<input type="text" id="title" bind:value="{token}" />
		</div>
		<Button type="submit" mode="peace" {disabled}>Load</Button>
	</form>
</Modal>
