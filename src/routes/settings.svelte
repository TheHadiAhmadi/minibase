<script>
	// @ts-nocheck

	import { Card, CardTitle, FormGroup, Label, Toggle } from '@ubeac/svelte-components';
</script>

<div class="space-y-2">
	<FormGroup inline class="flex items-center justify-between border-b border-black/25 !p-4">
		<Label>Setting 1</Label>
		<Toggle />
	</FormGroup>
	<FormGroup inline class="flex items-center justify-between border-b border-black/25 !p-4">
		<Label>Setting 1.5</Label>
		<Toggle />
	</FormGroup>
	<FormGroup inline>
		<Label>Setting 2</Label>
		<Toggle />
	</FormGroup>
</div>
