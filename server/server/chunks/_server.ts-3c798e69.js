const data = [];
async function GET() {
  return new Response(JSON.stringify({ data: data.map((d) => ({ name: d.name, id: d.id })) }));
}
async function POST({ request }) {
  const body = await request.json();
  console.log(body);
  const apiKey = "TODO: GENERATE";
  data.push({ name: body.name, apiKey, id: "" + data.length + 1 });
  return new Response(JSON.stringify({ data: data[data.length - 1], apiKey }));
}

export { GET, POST };
//# sourceMappingURL=_server.ts-3c798e69.js.map
