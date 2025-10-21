<script>
	let { onCancel, onClose, title } = $props();
</script>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        z-index: 10;
    }

    .modal {
        position: fixed;
        top: 10vh;
        left: 10%;
        width: 80%;
        max-height: 80vh;
        background: white;
        border-radius: 5px;
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        overflow: scroll;
    }

    h1 {
        padding: 1rem;
        margin: 0;
        border-bottom: 1px solid #ccc;
        font-family: 'Roboto Slab', sans-serif;
    }

    .content {
        padding: 1rem;
    }


    @media (min-width: 768px) {
        .modal {
            width: 40rem;
            left: calc(50% - 20rem);
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div class="modal-backdrop" onclick="{onCancel}"></div>
<div class="modal">
	<div class="header">
		<div>
			{#if title}
				<h1>{title}</h1>
			{/if}
		</div>
		<button onclick="{onClose}">X</button>
	</div>
	<div class="content">
		<slot/>
	</div>
</div>