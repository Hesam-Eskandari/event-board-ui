<script lang="ts">
</script>

<style>
    .visualization-card {
        display: block;
        min-width: 250px;
        min-height: 150px;
				width: 100%;
				height: 100%;
        background-color: #fafafa !important;
        border: 1px solid #ccc !important;
        border-radius: 15px;
				z-index: 1;
    }
		.content {
        box-sizing: border-box;
        padding: 15px;
				width: 100%;
				height: 100%;
		}
</style>

<section class="visualization-card">
	<div class="content">
			<slot />
	</div>
</section>
