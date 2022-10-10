import type { ProjectInfoPromise } from "$types";
import { getProject } from "./project";


export class ResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ResponseError"; // (2)
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

export function respond(
  body: object | string | ResponseError | Error,
  options?: { status: number; headers: HeadersInit }
) {
  if (body instanceof Error) {
    return respondError(body);
  } else {
    const status = options?.status ?? 200;
    const headers = options?.headers ?? {};
    return new Response(JSON.stringify(body ?? {}), { status, headers });
  }
}
