import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QXGJpzTU.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DQaSTBlS.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact Us", "data-astro-cid-uw5kdbxl": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container section" data-astro-cid-uw5kdbxl> <div class="contact-grid" data-astro-cid-uw5kdbxl> <div class="contact-info" data-astro-cid-uw5kdbxl> <h1 data-astro-cid-uw5kdbxl>Get in Touch</h1> <p data-astro-cid-uw5kdbxl>
We'd love to hear from you. Fill out the form or reach us
                    via phone or email.
</p> <div class="info-item" data-astro-cid-uw5kdbxl> <h3 data-astro-cid-uw5kdbxl>Visit Us</h3> <p data-astro-cid-uw5kdbxl>123 Example Street<br data-astro-cid-uw5kdbxl>City, State, Zip</p> </div> <div class="info-item" data-astro-cid-uw5kdbxl> <h3 data-astro-cid-uw5kdbxl>Call Us</h3> <p data-astro-cid-uw5kdbxl>+1 (555) 123-4567</p> </div> </div> <div class="contact-form-wrapper" data-astro-cid-uw5kdbxl> <form action="https://api.web3forms.com/submit" method="POST" class="contact-form" data-astro-cid-uw5kdbxl> <!-- Replace with your Access Key --> <input type="hidden" name="access_key" value="10d6183a-956b-4ba4-8616-619b093dac0e" data-astro-cid-uw5kdbxl> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="name" data-astro-cid-uw5kdbxl>Name</label> <input type="text" id="name" name="name" required placeholder="Your Name" data-astro-cid-uw5kdbxl> </div> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="email" data-astro-cid-uw5kdbxl>Email</label> <input type="email" id="email" name="email" required placeholder="your.email@example.com" data-astro-cid-uw5kdbxl> </div> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="message" data-astro-cid-uw5kdbxl>Message</label> <textarea id="message" name="message" rows="5" required placeholder="How can we help you?" data-astro-cid-uw5kdbxl></textarea> </div> <button type="submit" class="btn-submit" data-astro-cid-uw5kdbxl>Send Message</button> </form> </div> </div> </div> ` })} `;
}, "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/contact.astro", void 0);

const $$file = "D:/Business/PN Lab/Code/DiepMai6DoGoThoCungUS_Website_PROD/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Contact,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
