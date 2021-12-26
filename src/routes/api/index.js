import db from '$lib/db'

export async function get(request) {

    const database = await db
    console.log(database)
    return {    
        body: '123'
    }
}