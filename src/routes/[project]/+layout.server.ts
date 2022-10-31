import api from "$services/api";
import type { LayoutServerLoadEvent } from "./$types";

export async function load({ params, cookies }: LayoutServerLoadEvent) {
  const apiKey = cookies.get("apiKey") ?? "";
  if (!apiKey)
    return {
      apiKey: "",
      scopes: [],
      project: null,
    };

  try {
    api.setApiKey(apiKey);
    const result = await api.getProject(params.project);

    return {
      apiKey,
      project: result.project,
      scopes: result.scopes,
    };
  } catch (err) {
    console.log("Found error", err);

    cookies.delete("apiKey");

    return {
      apiKey: "",
      scopes: [],
      project: null,
    };
  }
}
