<script lang="ts">
	let { onClick, mode='success', type='button', disabled=false }:
		{
			onClick?: () => any;
			mode?:'success' | 'danger' | 'peace';
			type: 'button'  | 'submit' | 'reset' | null | undefined;
			disabled?: boolean;
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

		.peace {
				background-color: #07ab07;
		}

		.peace:disabled {
				background-color: #77bb77;
		}
</style>
<button class="{mode}" {type} on:click={click} {disabled}><slot /></button>