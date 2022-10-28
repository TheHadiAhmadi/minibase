import { a as alertMessage } from "../../../../../chunks/alert2.js";
import { r as redirect } from "../../../../../chunks/index2.js";
async function load({ parent, params }) {
  const data = await parent();
  console.log({ data });
  const collection = data.project.collections.find(
    (coll) => coll.name === params.name
  );
  if (!collection) {
    alertMessage.showError("collection doesn't exists");
    throw redirect(307, `/${params.project}`);
  }
  return {
    collection
  };
}
export {
  load
};
