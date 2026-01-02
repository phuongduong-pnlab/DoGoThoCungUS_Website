import { e as createComponent, m as maybeRenderHead, l as renderScript, h as addAttribute, r as renderTemplate, f as createAstro, n as renderHead, k as renderComponent, o as renderSlot } from './astro/server_QXGJpzTU.mjs';
import 'piccolore';
/* empty css                         */
import 'clsx';

const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const links = [
    { text: "Products", href: "/products" },
    { text: "Hot Deals", href: "/deals" },
    { text: "About", href: "/about" },
    { text: "Locations", href: "/locations" },
    { text: "Contact", href: "/contact" }
  ];
  return renderTemplate`${maybeRenderHead()}<header id="main-header" data-astro-cid-pux6a34n> <div class="container header-inner" data-astro-cid-pux6a34n> <a href="/" class="logo" data-astro-cid-pux6a34n> <span class="logo-text" data-astro-cid-pux6a34n>DiepMai</span> <span class="slogan" data-astro-cid-pux6a34n>Furniture & Decor</span> </a> <nav class="desktop-nav" data-astro-cid-pux6a34n> <ul data-astro-cid-pux6a34n> ${links.map((link) => renderTemplate`<li data-astro-cid-pux6a34n> <a${addAttribute(link.href, "href")} data-astro-cid-pux6a34n>${link.text}</a> </li>`)} </ul> </nav> <button id="mobile-menu-btn" aria-label="Toggle menu" data-astro-cid-pux6a34n> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-pux6a34n> <line x1="3" y1="12" x2="21" y2="12" data-astro-cid-pux6a34n></line> <line x1="3" y1="6" x2="21" y2="6" data-astro-cid-pux6a34n></line> <line x1="3" y1="18" x2="21" y2="18" data-astro-cid-pux6a34n></line> </svg> </button> </div> <div id="mobile-menu-overlay" data-astro-cid-pux6a34n> <nav class="mobile-nav" data-astro-cid-pux6a34n> <ul data-astro-cid-pux6a34n> ${links.map((link) => renderTemplate`<li data-astro-cid-pux6a34n> <a${addAttribute(link.href, "href")} data-astro-cid-pux6a34n>${link.text}</a> </li>`)} </ul> <button id="close-menu-btn" aria-label="Close menu" data-astro-cid-pux6a34n> Close </button> </nav> </div> </header>  ${renderScript($$result, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/components/Navigation.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="site-footer section" data-astro-cid-sz7xmlte> <div class="container footer-grid" data-astro-cid-sz7xmlte> <div class="footer-brand" data-astro-cid-sz7xmlte> <h3 data-astro-cid-sz7xmlte>DiepMai</h3> <p data-astro-cid-sz7xmlte>
Luxury furniture, authentic ceramics, and fine copper ware for
                the modern home.
</p> </div> <div class="footer-links" data-astro-cid-sz7xmlte> <h4 data-astro-cid-sz7xmlte>Shop</h4> <ul data-astro-cid-sz7xmlte> <li data-astro-cid-sz7xmlte><a href="/products?category=furniture" data-astro-cid-sz7xmlte>Furniture</a></li> <li data-astro-cid-sz7xmlte><a href="/products?category=ceramics" data-astro-cid-sz7xmlte>Ceramics</a></li> <li data-astro-cid-sz7xmlte><a href="/products?category=copper" data-astro-cid-sz7xmlte>Copper Ware</a></li> <li data-astro-cid-sz7xmlte><a href="/deals" data-astro-cid-sz7xmlte>Hot Deals</a></li> </ul> </div> <div class="footer-contact" data-astro-cid-sz7xmlte> <h4 data-astro-cid-sz7xmlte>Contact</h4> <ul data-astro-cid-sz7xmlte> <li data-astro-cid-sz7xmlte>123 Example Street, City, State</li> <li data-astro-cid-sz7xmlte>+1 (555) 123-4567</li> <li data-astro-cid-sz7xmlte>contact@example.com</li> </ul> </div> <div class="footer-map" data-astro-cid-sz7xmlte> <!-- Map placeholder as requested --> <div class="map-placeholder" data-astro-cid-sz7xmlte> <span data-astro-cid-sz7xmlte>Map Location</span> </div> </div> </div> <div class="footer-bottom" data-astro-cid-sz7xmlte> <p data-astro-cid-sz7xmlte>
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} DiepMai Store. All rights reserved.
</p> </div> </footer> `;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/components/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "High quality furniture, ceramic, and copper ware."
  } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} | DiepMai Store</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderComponent($$result, "Navigation", $$Navigation, { "data-astro-cid-sckkx6r4": true })} <main data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-sckkx6r4": true })} </body></html>`;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
