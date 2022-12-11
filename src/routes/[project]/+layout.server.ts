import api from "$services/api";
import type { LayoutServerLoadEvent } from "./$types";

export async function load({
  request,
  params,
  cookies,
}: LayoutServerLoadEvent) {
  const apiKey = cookies.get("apiKey") ?? "";
  console.log("request: ", request);
  console.log("load", { apiKey });

  const host = request.headers.get('host');

  const url = 'https://' + host;
  if (!apiKey)
    return {
      url,
      apiKey: "",
      scopes: [],
      project: null,
    };

  try {
    await api.setApiKey(apiKey);
    const result = await api.getProject(params.project);

    console.log("project", { result });

    return {
      url,
      apiKey,
      project: result.project,
      scopes: result.scopes,
    };
  } catch (err) {
    console.log("Found error", err);

    // cookies.delete("apiKey");

    return {
      url,
      apiKey: "",
      scopes: [],
      project: null,
    };
  }
}
