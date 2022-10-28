import { c as create_ssr_component } from "../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"flex flex-col gap-3 h-screen w-screen bg-gradient-to-tl from-blue-200 to-cyan-100 text-lg items-center justify-center"}"><p class="${"text-xl text-gray-700 font-bold"}">Welcome to Minibase</p>
  <a href="${"/projects"}" class="${"no-underline hover:no-underline p-2 rounded shadow hover:shadow-xl bg-blue-500 focus:bg-blue-500 text-white hover:bg-blue-600 border-none transition"}">Get Started</a></div>`;
});
export {
  Page as default
};
