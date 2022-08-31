import { getAppName } from "$lib/helpers";
import { errorResponse, TableService } from "$lib/services";


export async function GET({}) {
    console.log("RETURN DATA")
}

export async function DELETE({request, platform, locals, params}) {
    const appName = getAppName(request.url)

    const tableName = params.table;
    const user = locals.user;
    const db = platform.db;

    try {
        const tableService = new TableService(db, user, appName);
        await tableService.removeTable(tableName);
    
        return new Response(JSON.stringify({status: 200, success: true}))
    } catch(err) {
        return errorResponse(err)
    }
    
}   
