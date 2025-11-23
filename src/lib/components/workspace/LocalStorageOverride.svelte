<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	let {
		tag,
		onClose,
		onCancel,
		onSave }: {
		tag: string;
		onClose: () => void;
		onCancel: () => void;
		onSave: () => void;
	} = $props();

</script>

<Modal {onClose} {onCancel} title="Force Save Workspace In Browser">
		<div>Workspace {tag} is already saved in browser. You can rename the current workspace and save it after, or override the existing workspace.</div>
		<Button type="button" mode="warn" onClick={onSave}>Override</Button>
</Modal>