export const csr = false;

export async function load({parent}) {
    const data = await parent()
    return {
        ...data
    }
}