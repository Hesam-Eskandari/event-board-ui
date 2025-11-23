<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	let {
		onClose,
		onCancel,
		onSave }: {
		onClose: () => void;
		onCancel: () => void;
		onSave: () => void;
	} = $props();

	let tag = $state('');

</script>

<style>
	.warning {
			color: white;
			background-color: orangered;
	}
</style>

<Modal {onClose} {onCancel} title="Save Workspace In Browser">
		<div>Save this workspace in your browser. You can access it later from the "Load Workspace" option in the menu.</div>
		<div class="warning">Warning: save a workspace only in your personal computer. Anyone can access this workspace using the current browser on this machine.</div>
		<Button type="button" mode="warn" onClick={onSave}>Save</Button>
</Modal>