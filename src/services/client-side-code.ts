import type { ProjectFunction } from "$types";
import api from "./api";

let functionTemplate = `/* DO NOT EDIT MANUALLY, 
THIS FILE IS AVAILABLE AT https://theminibase.com/%%name%%/%%file%%.js */  

const minibase = (appName) => {
  let token = "";

  async function run(functionName, data = {}) {
      const baseUrl = "https://cloud-3.domcloud.io/" + appName + '/';
      const opts = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token,
          },
          body: JSON.stringify(data),
      };

      const res = await fetch(baseUrl + functionName, opts);
      const result = await res.json();

      if (result.error) {
          console.log(result.error)
          throw new Error(result.error.message);
      }

      return result.data;
  }

  return {
      setToken(value) {
          token = value;
      },
      getToken() {
          return token;
      },
      %%functions%%
  };
};

`;

export async function getClientSideCode(
  project: string,
  type: "module" | "cdn" = "module"
) {
  const fns = await api.getFunctions(project);

  const functions = fns
    .map(
      (fn: ProjectFunction) => `${fn.name}: (data) => run("${fn.name}", data)`
    )
    .join(",\n      ");

  let result = functionTemplate.replace("%%functions%%", functions);
  result = result.replace("%%name%%", project);
  result = result.replace("%%file%%", type === "module" ? "mod" : "cdn");

  if (type === "module") {
    result += `\nexport default minibase("${project}");`;
  } else {
    result = `(function() {\n${result}\nif(window){window['${project}']=minibase("${project}")}})()`;
  }
  return result;
}
