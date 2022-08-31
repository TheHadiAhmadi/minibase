import { baseUrl } from "$lib/helpers";

export async function apiCreateApp(app) {
    const result = await fetch(baseUrl() + '/index.json', {
        method: 'POST',
        body: JSON.stringify(app)
    }).then(res => res.json())
    
    return result
}