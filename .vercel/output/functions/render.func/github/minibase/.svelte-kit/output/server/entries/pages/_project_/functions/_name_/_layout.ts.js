import { a as alertMessage } from "../../../../../chunks/alert2.js";
import { r as redirect } from "../../../../../chunks/index2.js";
async function load({ parent, params }) {
  const data = await parent();
  console.log({ data });
  const fn = data.project.functions.find(
    (fn2) => fn2.name === params.name
  );
  if (!fn) {
    alertMessage.showError("function doesn't exists");
    throw redirect(307, `/${params.project}`);
  }
  return {
    function: fn
  };
}
export {
  load
};
