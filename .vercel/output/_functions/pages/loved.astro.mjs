import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QXGJpzTU.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DQaSTBlS.mjs';
export { renderers } from '../renderers.mjs';

const $$Loved = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Loved Products" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container section"> ${renderComponent($$result2, "LovedProductsList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/components/LovedProducts", "client:component-export": "default" })} </div> ` })}`;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/loved.astro", void 0);

const $$file = "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/loved.astro";
const $$url = "/loved";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Loved,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
