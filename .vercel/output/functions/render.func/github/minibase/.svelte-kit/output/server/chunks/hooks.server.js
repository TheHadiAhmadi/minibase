import { a as respondError } from "./index4.js";
const handle = async ({ event, resolve }) => {
  const project = event.params.project ?? "";
  try {
    let apiKey = event.request.headers.get("apiKey") ?? "";
    console.log({ apiKey });
    if (!apiKey) {
      apiKey = event.cookies.get(`${project}-apikey`) ?? "";
    }
    event.locals.apiKey = apiKey;
    return await resolve(event);
  } catch (err) {
    console.log("ERROR", err);
    return respondError(err);
  }
};
const handleError = ({ error, event }) => {
  console.log("handleError", error, error.message, error.status);
  return {
    message: error.message ?? "Internal Server Error",
    status: error.status ?? 500
  };
};
export {
  handle,
  handleError
};
