import { VM } from 'vm2';
import { g as getCode } from './index3-73d0b542.js';

function DB(collection) {
  let _data = [];
  return {
    insert(data2) {
      const value = { value: data2, id: crypto.randomUUID() };
      _data.push(value);
      return value;
    },
    remove(id) {
      _data = _data.filter((data2) => data2.id !== id);
      return true;
    },
    update(id, data2) {
      _data = _data.map((d) => {
        if (d.id == id)
          return data2;
        return d;
      });
      return { id, value: data2 };
    },
    get(id) {
      return _data.find((data2) => data2.id === id);
    },
    find(filter = {}, options = {}) {
      const take = options.take ?? -1;
      const skip = options.skip ?? 0;
      const result = _data.filter((data2) => {
        Object.entries(filter).map(([key, value]) => {
          if (data2[key] !== value) {
            return false;
          }
        });
        return true;
      });
      if (take === -1)
        return result.slice(skip);
      if (take > result.length)
        return result.slice(skip);
      return result.slice(skip, skip + take);
    }
  };
}
async function handle({ request, params }) {
  const id = params.id;
  console.log("New Request -------------- " + id);
  const { code } = await getCode({ name: id });
  if (!code) {
    return new Response(
      JSON.stringify({ message: "Function doesn't exists" }),
      { status: 404 }
    );
  }
  const input = code + "\nhandle(__request);";
  try {
    const vm = new VM({ timeout: 5e3 });
    vm.freeze(request, "__request");
    vm.freeze(fetch, "fetch");
    vm.freeze(Headers, "Headers");
    vm.freeze(Response, "Response");
    vm.freeze(DB, "DB");
    const output = await vm.run(input);
    console.log(output);
    if (output instanceof Response) {
      return output;
    } else if (typeof output === "object") {
      const headers = output.headers ?? {};
      const status = output.status ?? 200;
      const body = output.body;
      const bodyInit = typeof body === "object" ? JSON.stringify(body) : body;
      return new Response(bodyInit, {
        status,
        headers
      });
    } else if (typeof output === "string" || typeof output === "number") {
      return new Response(output.toString(), { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
function GET(event) {
  return handle(event);
}
function POST(event) {
  return handle(event);
}
function PUT(event) {
  return handle(event);
}
function DELETE(event) {
  return handle(event);
}

export { DELETE, GET, POST, PUT };
//# sourceMappingURL=_server.ts-5d7d1cfc.js.map
