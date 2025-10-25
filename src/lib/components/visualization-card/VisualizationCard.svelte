<style>
    .visualization-card {
        display: block;
        min-width: 300px;
        min-height: 200px;
				width: 100%;
				height: 100%;
        background-color: #fafafa !important;
        border: 1px solid #ccc !important;
        border-radius: 15px;
        padding: 20px;
        margin: 10px;
				z-index: 1;
    }
</style>

<section class="visualization-card">
	<slot />
</section>
