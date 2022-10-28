import { r as respond } from "../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../chunks/index5.js";
import { v as validateApiKey } from "../../../../chunks/apikey.js";
import { b as getProject, u as updateProject, r as removeProject } from "../../../../chunks/project.js";
async function GET({ request, locals, params }) {
  const scopes = await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_DATA],
    [APIKEY_SCOPES.READ_ENV],
    [APIKEY_SCOPES.READ_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  console.log({ scopes });
  const projectPromise = await getProject({
    name: params.project
  });
  const project = {
    name: projectPromise.name,
    id: projectPromise.id
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
async function POST({ request, locals, cookies, params }) {
  const body = await request.json();
  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN
  ]);
  await updateProject({ name: params.project, body });
  const result = await getProject({
    name: body.name ?? params.project
  });
  const data = {
    ...result,
    functions: await result.functions,
    collections: await result.collections
  };
  if (body.name) {
    cookies.delete(`${params.project}-apikey`);
    cookies.set(`${body.name}-apikey`, locals.apiKey, {
      path: "/",
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60
    });
  }
  return respond({ data });
}
async function DELETE({ locals, params }) {
  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN
  ]);
  const data = await removeProject({ name: params.project });
  return respond({ data });
}
export {
  DELETE,
  GET,
  POST
};
