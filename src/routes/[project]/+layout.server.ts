import { invalid, type Actions } from "@sveltejs/kit";
import type { LayoutServerLoadEvent } from "./$types";

export async function load({ params, cookies, fetch }: LayoutServerLoadEvent) {
  const key = `${params.project}-apikey`;
  const apiKey = cookies.get(key) ?? "";
  console.log({ apiKey });
  try {
    const result = await fetch("/api/" + params.project, {
      headers: { 
        ApiKey: apiKey
      },
    }).then((res) => res.json());

    return {
      apiKey,
      scopes: result.scopes,
      project: result.data,
    };
  } catch (err) {
    console.log("Found error", err);
    // reset apiKey
    cookies.delete(key);

    return {
      apiKey: "",
      scopes: [],
      project: null,
    };
  }
}