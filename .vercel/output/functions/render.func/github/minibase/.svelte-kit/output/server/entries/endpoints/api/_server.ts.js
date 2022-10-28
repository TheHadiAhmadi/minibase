import { r as respond, R as ResponseError } from "../../../chunks/index4.js";
import { g as getAllProjects, a as addProject } from "../../../chunks/project.js";
async function GET() {
  return respond({ data: await getAllProjects() });
}
async function POST({ request, cookies }) {
  const body = await request.json();
  if (!body.name)
    throw new ResponseError(400, "invalid request, name is required");
  const data = await addProject({ body });
  const apiKey = data.apiKeys[0].value ?? "Error";
  cookies.set(`${body.name}-apikey`, apiKey, {
    httpOnly: true,
    path: "/",
    maxAge: 10 * 365 * 24 * 60 * 60
  });
  return respond({ data });
}
export {
  GET,
  POST
};
