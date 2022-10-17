import { activeProject } from "$stores";
import type { PageLoadEvent } from "./$types";
import { get } from "svelte/store";
import type { ProjectFunction } from "$types";
import { redirect } from "@sveltejs/kit";
import { alertMessage } from "$stores/alert";

export async function load({ parent, params }: PageLoadEvent) {
  const data = await parent();
  const func = data.project.functions.find(
    (fn: ProjectFunction) => fn.name === params.name
  );

  if (!func) {
    alertMessage.showError("function doesn't exists");

    throw redirect(307, `/${params.project}`);
  }

  return {
    function: func,
  };
}
