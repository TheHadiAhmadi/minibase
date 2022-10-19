import {
  addProject,
  getAllProjects,
  getProject,
  respond,
  ResponseError,
} from "$server/services";
import type { Project } from "$types";
import type { RequestEvent } from "./$types";

// Get All Projects
export async function GET() {
  return respond({ data: await getAllProjects({}) });
}

// Add Project
export async function POST({ request, cookies }: RequestEvent) {
  const body = (await request.json()) as Project;

  if (!body.name)
    throw new ResponseError(400, "invalid request, name is required");

  const data = await addProject({ body });

  const apiKey = data.apiKeys![0].value ?? "Error";

  cookies.set(`${body.name}-apikey`, apiKey, {
    httpOnly: true,
    path: "/",
    maxAge: 10 * 365 * 24 * 60 * 60,
  });

  return respond({ data });
}
