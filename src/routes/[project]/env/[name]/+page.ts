import { alertMessage } from "$stores/alert";
import { redirect } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";

export async function load({ params, parent }: PageLoadEvent) {
  const key = params.name;
  const data = await parent();

  if (data.project.env.hasOwnProperty(key)) {
    let value = data.project.env[key];

    if (value === " ") value = "";

    return {
      key,
      value,
    };
  } else {
    alertMessage.showError("Environment variable doesn't exists");

    throw redirect(307, `/${params.project}`);
  }
}
