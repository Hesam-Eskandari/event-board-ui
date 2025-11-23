<script lang="ts">
	import type { Snippet } from 'svelte';

	let { onClick, mode='success', type='button', disabled=false, children }:
		{
			onClick?: () => any;
			mode?:'success' | 'danger' | 'peace' | 'warn';
			type: 'button'  | 'submit' | 'reset' | null | undefined;
			disabled?: boolean;
			children: Snippet;
		} = $props();

	function click(e: MouseEvent) {
		e.stopPropagation();
		onClick?.();
	}

</script>
<style>
		button {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        color: #fff;
		}
    .success {
        background-color: #007bff;

    }
		.success:disabled {
        background-color: #7799bb;
		}

		.danger {
				background-color: #dc3545;
		}

		.danger:disabled {
				background-color: #bb7777;
		}

		.peace {
				background-color: #07ab07;
		}

		.peace:disabled {
				background-color: #77bb77;
		}

		.warn {
				background-color: #ffc107;
		}

		.warn:disabled {
				background-color: #bbbb77;
		}
</style>
<button class="{mode}" {type} onclick={click} {disabled}>{@render children?.()}</button>