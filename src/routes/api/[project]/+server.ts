import {
  respond,
  ResponseError,
  updateProject,
  validateApiKey,
} from "$server/services";
import type { ProjectInfo } from "$types";
import type { RequestEvent } from "./$types";

// Get Project Info
export async function GET({ request, params }: RequestEvent) {
  const project = await validateApiKey(
    params.project,
    request.headers.get("ApiKey")
  );

  const data: ProjectInfo = {
    ...project,
    functions: await project.functions,
    collections: await project.collections,
  };

  return respond({ data });
}

export async function POST({ request, params }: RequestEvent) {
  const body = await request.json();
  
  const project = await validateApiKey(
    params.project,
    request.headers.get("ApiKey")
  );

  const result = await updateProject({ name: params.project, body });

  const data: ProjectInfo = {
    ...project,
    ...result,
    functions: await project.functions,
    collections: await project.collections,
  };

  return respond({ data });
}
