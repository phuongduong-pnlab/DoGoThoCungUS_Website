import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_QXGJpzTU.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DQaSTBlS.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
/* empty css                                   */
import { getProducts } from '../../chunks/googleSheets_D3niqPPj.mjs';
export { renderers } from '../../renderers.mjs';

function ProductDetail({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };
  return /* @__PURE__ */ jsxs("div", { className: "product-detail-grid", children: [
    /* @__PURE__ */ jsxs("div", { className: "gallery-section", children: [
      /* @__PURE__ */ jsx("div", { className: "main-image-container group", children: selectedImage ? /* @__PURE__ */ jsx("img", { src: selectedImage, alt: product.name, className: "main-image" }) : /* @__PURE__ */ jsx("div", { className: "no-image-large", children: "No Image" }) }),
      /* @__PURE__ */ jsx("div", { className: "thumbnail-list", children: product.images.map((img, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedImage(img),
          className: `thumbnail-btn ${selectedImage === img ? "active" : ""}`,
          children: /* @__PURE__ */ jsx("img", { src: img, alt: `View ${idx + 1}` })
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "info-section", children: [
      /* @__PURE__ */ jsx("h1", { className: "product-title", children: product.name }),
      /* @__PURE__ */ jsx("p", { className: "product-category", children: product.category }),
      /* @__PURE__ */ jsxs("div", { className: "product-price", children: [
        "$",
        currentPrice
      ] }),
      /* @__PURE__ */ jsx("div", { className: "product-description", children: /* @__PURE__ */ jsx("p", { children: product.description }) }),
      product.variants && product.variants.length > 0 && /* @__PURE__ */ jsxs("div", { className: "variants-section", children: [
        /* @__PURE__ */ jsx("h3", { children: "Available Options" }),
        /* @__PURE__ */ jsx("div", { className: "variant-options", children: product.variants.map((v, idx) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleSelectVariant(v),
            className: `variant-chip ${selectedVariant === v ? "active" : ""}`,
            children: [
              v.size && /* @__PURE__ */ jsx("span", { children: v.size }),
              v.color && /* @__PURE__ */ jsxs("span", { children: [
                " - ",
                v.color
              ] })
            ]
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "actions-section", children: [
        /* @__PURE__ */ jsx("button", { className: "btn-primary-large", children: "Contact to Order" }),
        /* @__PURE__ */ jsx("button", { className: "btn-secondary-large", children: "Add to Loved" })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": product.name, "description": product.description, "data-astro-cid-y5jmkon6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container section" data-astro-cid-y5jmkon6> <div class="breadcrumbs" data-astro-cid-y5jmkon6> <a href="/" data-astro-cid-y5jmkon6>Home</a> <span data-astro-cid-y5jmkon6>/</span> <a href="/products" data-astro-cid-y5jmkon6>Products</a> <span data-astro-cid-y5jmkon6>/</span> <span data-astro-cid-y5jmkon6>${product.name}</span> </div> ${renderComponent($$result2, "ProductDetail", ProductDetail, { "product": product, "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/components/ProductDetail", "client:component-export": "default", "data-astro-cid-y5jmkon6": true })} </div> ` })} `;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/products/[id].astro", void 0);

const $$file = "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/products/[id].astro";
const $$url = "/products/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
