import {
  removeProject,
  respond,
  updateProject,
  validateApiKey,
} from "$server/services";
import type { ApiKeyScopes, ProjectInfo, ProjectInfoPromise } from "$types";
import { getProject } from "../../../server/services";
import { APIKEY_SCOPES } from "../../../types";
import type { RequestEvent } from "./$types";

// Get Project Info
export async function GET({ request, locals, params }: RequestEvent) {
  const scopes = await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_DATA],
    [APIKEY_SCOPES.READ_ENV],
    [APIKEY_SCOPES.READ_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  console.log({ scopes });

  const project: ProjectInfoPromise = await getProject({
    name: params.project,
  });

  const data: ProjectInfo = {
    name: project.name,
    id: project.id,
  };

  if (scopes.includes(APIKEY_SCOPES.PROJECT_ADMIN)) {
    data.apiKeys = await project.apiKeys;
    data.env = project.env;
    data.collections = await project.collections;
    data.functions = await project.functions;

    return respond({ data, scopes });
  }

  if (scopes.includes(APIKEY_SCOPES.READ_ENV)) {
    data.env = project.env;
  }
  if (scopes.includes(APIKEY_SCOPES.READ_DATA)) {
    data.collections = await project.collections;
  }
  if (scopes.includes(APIKEY_SCOPES.READ_FUNCTION)) {
    data.functions = await project.functions;
  }

  return respond({ data, scopes });
}

export async function POST({ request, locals, cookies, params }: RequestEvent) {
  const body = await request.json();

  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN,
  ]);

  await updateProject({ name: params.project, body });

  const result: ProjectInfoPromise = await getProject({
    name: body.name ?? params.project,
  });

  const data = {
    ...result,
    functions: await result.functions,
    collections: await result.collections,
  };

  if (body.name) {
    cookies.delete(`${params.project}-apikey`);
    cookies.set(`${body.name}-apikey`, locals.apiKey, {
      path: "/",
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60,
    });
  }

  return respond({ data });
}

export async function DELETE({ locals, params }: RequestEvent) {
  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN,
  ]);

  const result = await removeProject({ name: params.project });

  return respond({ data: result });
}
