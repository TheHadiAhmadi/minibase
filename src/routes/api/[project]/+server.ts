import { respond, updateProject, validateApiKey } from "$server/services";
import type { ProjectInfo } from "$types";
import { getProject } from "../../../server/services";
import { APIKEY_SCOPES } from "../../../types";
import type { RequestEvent } from "./$types";

// Get Project Info
export async function GET({ request, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    request.headers.get("ApiKey"),
    [
      APIKEY_SCOPES.READ_DATA,
      APIKEY_SCOPES.READ_ENV,
      APIKEY_SCOPES.READ_FUNCTION,
    ],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const data: ProjectInfo = await getProject({ name: params.project });

  return respond({
    data: {
      ...data,
      functions: await data.functions,
      collections: await data.collections,
    },
  });
}

export async function POST({ request, params }: RequestEvent) {
  const body = await request.json();

  const project = await validateApiKey(
    params.project,
    request.headers.get("ApiKey"),
    [APIKEY_SCOPES.PROJECT_ADMIN]
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
