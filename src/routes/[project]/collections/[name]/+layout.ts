import { alertMessage } from "$stores/alert";
import type { ProjectCollection } from "$types";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoadEvent } from "./$types";

export async function load({ parent, params }: LayoutLoadEvent) {
  const data = await parent();
  console.log({ data });
  const collection: ProjectCollection = data.project.collections.find(
    (coll: ProjectCollection) => coll.name === params.name
  );

  if (!collection) {
    alertMessage.showError("collection doesn't exists");

    throw redirect(307, `/${params.project}`);
  }

  return {
    collection,
  };
}
