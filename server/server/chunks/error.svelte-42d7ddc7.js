import { c as create_ssr_component, b as subscribe, e as escape } from './index-5f4e863c.js';
import { p as page } from './stores-febd7740.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1>

<pre>${escape($page.error.message)}</pre>



${$page.error.frame ? `<pre>${escape($page.error.frame)}</pre>` : ``}
${$page.error.stack ? `<pre>${escape($page.error.stack)}</pre>` : ``}`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-42d7ddc7.js.map
