import { insert } from "$lib/dbApi"

export async function post({body}) {
    const result = await insert('apps', body)

    return {
        body: result
    }
}