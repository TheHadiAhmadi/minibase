import { r as respond } from "../../../../chunks/index4.js";
async function POST({ cookies, request }) {
  const body = await request.json();
  cookies.set(body.name, body.value, {
    path: "/",
    httpOnly: true,
    maxAge: 10 * 365 * 24 * 60 * 60
  });
  return respond({ data: true });
}
export {
  POST
};
