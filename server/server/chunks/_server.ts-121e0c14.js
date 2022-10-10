import { a as addCode } from './index3-73d0b542.js';

async function POST({ request }) {
  const body = await request.json();
  const { name, code } = body;
  console.log("add", { name, code });
  if (!name || !code) {
    return new Response(JSON.stringify({ message: "Invalid Request" }), { status: 400 });
  }
  if (!name.match(/[0-9a-zA-Z-_.]/)) {
    return new Response(JSON.stringify({ message: "Name should be valid" }), { status: 400 });
  }
  await addCode({ name, code });
  return new Response(
    JSON.stringify({ message: "Function Added successfully" })
  );
}

export { POST };
//# sourceMappingURL=_server.ts-121e0c14.js.map
