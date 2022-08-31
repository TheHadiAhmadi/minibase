<!-- <script context="module">
	import { page } from '$app/stores';

	export async function load({ params, fetch }) {
		const response = await fetch(`/${params.app}.json`).then((res) => res.json());

		if (response.status === 200) {
			return {
				stuff: {
					apiKeys: response.apiKeys,
					tables: response.tables,
					access: response.access
				}
			};
		}
		return {};
	}
</script> -->

<slot />
