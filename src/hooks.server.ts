// import { respondError } from "$server/services";
// import type { ResponseError } from "$types";

export class ResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ResponseError";
    this.status = status ?? 500;
  }
}

export function respondError(error: ResponseError | Error) {
  if (error instanceof ResponseError)
    return new Response(
      JSON.stringify({
        status: error.status,
        message: error.message ?? "Internal Server Error",
      }),
      { status: error.status ?? 500 }
    );

  return new Response(
    JSON.stringify({
      status: 500,
      message: error.message ?? "Internal Server Error",
    }),
    { status: 500 }
  );
}


import type { Handle, HandleServerError } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const project = event.params.project ?? "";
  try {
    let apiKey: string = event.request.headers.get("apiKey") ?? "";
    console.log({ apiKey });
    if (!apiKey) {
      apiKey = event.cookies.get(`${project}-apikey`) ?? "";
    }
    event.locals.apiKey = apiKey;

    return await resolve(event);
  } catch (err: any) {
    console.log("ERROR", err);
    return respondError(err);
  }
};

export const handleError: HandleServerError = ({ error, event }) => {
  console.log("handleError", error, error.message, error.status);
  return {
    message: (error as ResponseError).message ?? "Internal Server Error",
    status: (error as ResponseError).status ?? 500,
  };
};
