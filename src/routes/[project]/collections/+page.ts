import type { PageLoadEvent } from "./$types";

export async function load({ parent }: PageLoadEvent) {
  const data = await parent();
  console.log(data);
  return data;
}
