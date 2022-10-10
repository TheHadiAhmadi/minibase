import { respondError } from "$server/services";
import type { ResponseError } from "$types";
import type { Handle, HandleServerError } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  try {
    console.log("handle");
    return await resolve(event);
  } catch (err: any) {
    console.log("ERROR", err);
    return respondError(err);
  }
};

export const handleError: HandleServerError = ({ error, event }) => {
  return {
    message: (error as ResponseError).message ?? "Internal Server Error",
    status: (error as ResponseError).status ?? 500,
  };
};
