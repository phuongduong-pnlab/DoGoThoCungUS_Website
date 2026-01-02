import { getProducts } from '../../chunks/googleSheets_D3niqPPj.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const isAdmin = url.searchParams.get("admin") === "true";
  const allProducts = await getProducts();
  if (isAdmin) {
    return new Response(JSON.stringify(allProducts), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const publicProducts = allProducts.map((p) => {
    const { cost, profit, stock, ...publicProps } = p;
    return publicProps;
  });
  return new Response(JSON.stringify(publicProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
const POST = async ({ request }) => {
  const isAdmin = new URL(request.url).searchParams.get("admin") === "true";
  if (!isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return new Response("Missing ID", { status: 400 });
  const { updateProduct } = await import('../../chunks/googleSheets_D3niqPPj.mjs');
  const success = await updateProduct(id, updates);
  if (success) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response("Update Failed", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
