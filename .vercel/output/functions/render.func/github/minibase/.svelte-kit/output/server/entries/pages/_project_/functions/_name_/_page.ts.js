import { r as redirect } from "../../../../../chunks/index2.js";
import { a as alertMessage } from "../../../../../chunks/alert2.js";
async function load({ parent, params }) {
  const data = await parent();
  const func = data.project.functions.find(
    (fn) => fn.name === params.name
  );
  if (!func) {
    alertMessage.showError("function doesn't exists");
    throw redirect(307, `/${params.project}`);
  }
  return {
    function: func
  };
}
export {
  load
};
