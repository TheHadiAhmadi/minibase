import { alertMessage } from "$stores/alert";
import type { ProjectFunction } from "$types";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoadEvent } from "./$types";

export async function load({ parent, params }: LayoutLoadEvent) {
  const data = await parent();
  console.log({ data });
  const fn: ProjectFunction = data.project.functions.find(
    (fn: ProjectFunction) => fn.name === params.name
  );

  if (!fn) {
    alertMessage.showError("function doesn't exists");

    throw redirect(307, `/${params.project}`);
  }

  return {
    function: fn,
  };
}
