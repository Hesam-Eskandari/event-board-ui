<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let {
		onClose,
		onCancel,
		onExit
	}: {
		onClose: () => void;
		onCancel: () => void;
		onExit: () => void;
	} = $props();
</script>

<Modal {onClose} {onCancel} title="Exit Workspace">
		<div>
			Save a record of your workspace ID before leaving. You will need it to rejoin this workspace later.
		</div>
		<div>
			Are you sure you want to exit the workspace?
		</div>
		<Button type="button" mode="danger" onClick={onExit}>Yes, Exit the workspace</Button>
</Modal>

