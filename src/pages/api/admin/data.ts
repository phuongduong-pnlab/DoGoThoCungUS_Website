import type { APIRoute } from "astro";
import { getSheetData, addRowToSheet, updateRow, deleteRow } from "../../../lib/server/googleSheets";

// GET: Fetch rows
export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const sheetName = url.searchParams.get("sheet");
    if (!sheetName) return new Response(JSON.stringify({ error: "Missing sheet name" }), { status: 400 });

    try {
        const data = await getSheetData(sheetName.toUpperCase());
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

// POST: Add new row
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { sheetName, rowValues } = body;
        if (!sheetName || !rowValues) return new Response(JSON.stringify({ error: "Invalid parameters" }), { status: 400 });

        const success = await addRowToSheet(sheetName.toUpperCase(), rowValues);
        return success
            ? new Response(JSON.stringify({ success: true }), { status: 200 })
            : new Response(JSON.stringify({ error: "Failed to add row" }), { status: 500 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

// PUT: Update row
export const PUT: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { sheetName, id, rowValues } = body;
        if (!sheetName || !id || !rowValues) return new Response(JSON.stringify({ error: "Missing id or values" }), { status: 400 });

        const success = await updateRow(sheetName.toUpperCase(), id, rowValues);
        return success
            ? new Response(JSON.stringify({ success: true }), { status: 200 })
            : new Response(JSON.stringify({ error: "Failed to update row" }), { status: 500 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

// DELETE: Delete row
export const DELETE: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const sheetName = url.searchParams.get("sheet");
        const id = url.searchParams.get("id");

        if (!sheetName || !id) return new Response(JSON.stringify({ error: "Missing sheet or id" }), { status: 400 });

        const success = await deleteRow(sheetName.toUpperCase(), id);
        return success
            ? new Response(JSON.stringify({ success: true }), { status: 200 })
            : new Response(JSON.stringify({ error: "Failed to delete row" }), { status: 500 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
