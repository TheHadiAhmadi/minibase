<script>
    import clsx from 'clsx'
    let className;
    export {className as class}


$:classes = clsx('table-parent', className)
</script>
<div class={classes}>
	<table class="table">
		<slot />
	</table>
</div>

<style global lang="postcss">
	.table-parent {
		@apply overflow-auto;
	}
	.table {
		@apply w-full;
	}
	.table thead th {
		@apply text-left px-4 py-2 bg-[#efefef] border border-[#dedede];
	}
    .dark .table thead th {
        @apply bg-[#404040] border-[#505050];
    }

	.table tbody tr td {
		@apply py-1 border border-[#dedede];
	}
    .dark .table tbody tr td {
        @apply border-[#505050];
    }
    
</style>
