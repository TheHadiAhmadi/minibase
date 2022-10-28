import { a as alertMessage } from "../../../../../chunks/alert2.js";
import { r as redirect } from "../../../../../chunks/index2.js";
async function load({ params, parent }) {
  const key = params.name;
  const data = await parent();
  if (data.project.env.hasOwnProperty(key)) {
    let value = data.project.env[key];
    if (value === " ")
      value = "";
    return {
      key,
      value
    };
  } else {
    alertMessage.showError("Environment variable doesn't exists");
    throw redirect(307, `/${params.project}`);
  }
}
export {
  load
};
