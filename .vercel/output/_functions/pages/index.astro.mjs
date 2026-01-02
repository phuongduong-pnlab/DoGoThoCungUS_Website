import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QXGJpzTU.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DQaSTBlS.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  useEffect(() => {
    fetch("/api/products").then((res) => res.json()).then((data) => {
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to fetch products", err);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(lowerTerm) || p.category.toLowerCase().includes(lowerTerm)
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);
  const toggleLove = (id, e) => {
    e.preventDefault();
    const loved = JSON.parse(localStorage.getItem("lovedProducts") || "[]");
    if (loved.includes(id)) {
      const newLoved = loved.filter((lid) => lid !== id);
      localStorage.setItem("lovedProducts", JSON.stringify(newLoved));
    } else {
      loved.push(id);
      localStorage.setItem("lovedProducts", JSON.stringify(loved));
    }
    alert(`Product ${id} updated in favorites!`);
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "loading-state", children: "Loading products..." });
  return /* @__PURE__ */ jsxs("div", { className: "product-list-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "list-controls", children: [
      /* @__PURE__ */ jsx("div", { className: "category-filters", children: categories.map((cat) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveCategory(cat),
          className: `filter-btn ${activeCategory === cat ? "active" : ""}`,
          children: cat
        },
        cat
      )) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search products...",
          className: "search-input",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "product-grid", children: filteredProducts.map((product) => /* @__PURE__ */ jsxs("div", { className: "product-card", children: [
      /* @__PURE__ */ jsx("a", { href: `/products/${product.id}`, className: "card-image-link", children: product.images[0] ? /* @__PURE__ */ jsx(
        "img",
        {
          src: product.images[0],
          alt: product.name,
          className: "card-image"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "no-image", children: "No Image" }) }),
      /* @__PURE__ */ jsxs("div", { className: "card-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "card-header", children: [
          /* @__PURE__ */ jsx("h3", { className: "card-title", children: /* @__PURE__ */ jsx("a", { href: `/products/${product.id}`, children: product.name }) }),
          /* @__PURE__ */ jsxs("span", { className: "card-price", children: [
            "$",
            product.price
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "card-category", children: product.category }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => toggleLove(product.id, e),
            className: "btn-love",
            children: "Add to Loved"
          }
        )
      ] })
    ] }, product.id)) }),
    filteredProducts.length === 0 && /* @__PURE__ */ jsx("div", { className: "empty-state", children: "No products found." })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="hero" data-astro-cid-j7pv25f6> <div class="container hero-content" data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Exquisite Furniture & <br data-astro-cid-j7pv25f6>Timeless Decor</h1> <p data-astro-cid-j7pv25f6>
Discover our collection of handcrafted wood furniture, premium
				ceramics, and copper masterpieces.
</p> <a href="#shop" class="btn btn-primary" data-astro-cid-j7pv25f6>Shop Collection</a> </div> </section>  <section id="shop" class="section" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <h2 class="section-title" data-astro-cid-j7pv25f6>Our Collections</h2> ${renderComponent($$result2, "ProductList", ProductList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/components/ProductList", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> </section>  <section id="about" class="section bg-light" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="about-grid" data-astro-cid-j7pv25f6> <div class="about-text" data-astro-cid-j7pv25f6> <h2 class="section-title" data-astro-cid-j7pv25f6>About DiepMai</h2> <p data-astro-cid-j7pv25f6>
We bring you the finest selection of traditional
						craftsmanship and modern design. From the sturdy
						elegance of our wooden furniture to the delicate beauty
						of our ceramics.
</p> </div> <!-- Image placeholder would go here --> </div> </div> </section> ` })} `;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/index.astro", void 0);

const $$file = "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
