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

  const projectPromise: ProjectInfoPromise = await getProject({
    name: params.project,
  });

  const project: ProjectInfo = {
    name: projectPromise.name,
    id: projectPromise.id,
  };

  if (scopes.includes(APIKEY_SCOPES.PROJECT_ADMIN)) {
    project.apiKeys = await projectPromise.apiKeys;
    project.env = projectPromise.env;
    project.collections = await projectPromise.collections;
    project.functions = await projectPromise.functions;

    return respond({ data: { project, scopes } });
  }

  if (scopes.includes(APIKEY_SCOPES.READ_ENV)) {
    project.env = projectPromise.env;
  }
  if (scopes.includes(APIKEY_SCOPES.READ_DATA)) {
    project.collections = await projectPromise.collections;
  }
  if (scopes.includes(APIKEY_SCOPES.READ_FUNCTION)) {
    project.functions = await projectPromise.functions;
  }

  return respond({ data: { scopes, project } });
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

  const data = await removeProject({ name: params.project });

  return respond({ data });
}
