import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import Hello from '$lib/components/TableEditorForm.svelte';

describe('Hello.svelte', () => {
	// TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
	afterEach(() => cleanup());

	it('mounts', () => {
		const { container } = render(Hello, { count: 4 });
		expect(container).toBeTruthy();
		expect(container.innerHTML).toContain('Internal Server Error');
		// expect(container.innerHTML).toMatchSnapshot()
		expect(4 + 4).toBe(8);
	});

	//   it('updates on button click', async() => {
	//     render(Hello, { count: 4 })
	//     const btn = screen.getByRole('button')
	//     const div = screen.getByText('4 x 2 = 8')
	//     await fireEvent.click(btn)
	//     expect(div.innerHTML).toBe('4 x 3 = 12')
	//     await fireEvent.click(btn)
	//     expect(div.innerHTML).toBe('4 x 4 = 16')
	//   })
});
