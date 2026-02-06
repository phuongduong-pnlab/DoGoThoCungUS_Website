/// <reference types="astro/client" />
import { google } from 'googleapis';

const SPREADSHEET_ID = import.meta.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// --- 1. Auth & Connection ---
function getAuth() {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    console.warn("Missing Google Credentials, using Mock Data.");
    return null;
  }
  return new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: SCOPES,
  });
}

function getSheetsClient() {
  const auth = getAuth();
  if (!auth) return null;
  return google.sheets({ version: 'v4', auth });
}

// --- 2. Schema Definitions ---
export const SHEET_SCHEMA = {
  'PROD_VAR': ['SKU', 'Tên Hàng', 'Chất Liệu', 'Màu', 'Loại Kích Thước', 'Giá Bán', 'Tồn Kho', 'Danh Mục', 'Hình Ảnh', 'Mô Tả'],
  'CUSTOMERS': ['Customer ID', 'Name', 'Phone', 'Address', 'Email', 'Notes'],
  'ORDERS': ['Order ID', 'Date', 'Customer Phone', 'Total Amount', 'Status', 'Payment Method'],
  'ORDER_ITEMS': ['Order ID', 'SKU', 'Quantity', 'Price Sold'],
  'INVENTORY_LOG': ['Log ID', 'Date', 'SKU', 'Change', 'Reason'],
  'BUSINESS_ACTIVITIES': ['Date', 'Type', 'Category', 'Description', 'Amount'],
  'DISCOUNTS': ['Code', 'Type', 'Value', 'Expiry', 'Active'],
  'REVIEWS': ['Date', 'SKU', 'Customer', 'Rating', 'Comment', 'Approved'],
  'SUPPLIERS': ['Supplier ID', 'Name', 'Contact', 'Material Type'],
  'DEBTS': ['Transaction ID', 'Order ID', 'Type', 'Amount Paid', 'Remaining', 'Due Date'],
  'SHIPPING': ['Ship ID', 'Order ID', 'Carrier', 'Cost', 'Tracking', 'Status'],
  'WARRANTY': ['Warranty ID', 'Order ID', 'Product SKU', 'End Date', 'Claims']
};

// --- 3. Initialization Logic ---
export async function initializeDatabase() {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return { success: false, message: "Missing Credentials" };

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const existingSheets = meta.data.sheets?.map(s => s.properties?.title) || [];

    const requests = [];

    // 1. Create missing sheets
    for (const sheetName of Object.keys(SHEET_SCHEMA)) {
      if (!existingSheets.includes(sheetName)) {
        requests.push({
          addSheet: { properties: { title: sheetName } }
        });
      }
    }

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests }
      });
      console.log("Created missing sheets:", requests.length);
    }

    // 2. Update Headers
    // We do this sequentially or simply fire-and-forget for safety
    for (const [sheetName, headers] of Object.entries(SHEET_SCHEMA)) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Z1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] }
      });
    }

    return { success: true, message: "Database Structure Initialized Successfully" };

  } catch (e: any) {
    console.error("Init DB Failed:", e);
    return { success: false, message: e.message };
  }
}

// --- 4. Data Access (READ) ---

// Helper: safe JSON parse
function safeJSONParse(str: string) {
  try { return JSON.parse(str); } catch (e) { return []; }
}

export async function getProducts() {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return getMockProducts(); // Fallback

  try {
    // Read from PROD_VAR
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'PROD_VAR!A2:J', // Columns A-J
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // Group by Name (Col B / Index 1) OR Parent ID if we had it. 
    // Using Name for "Easy Maintenance" as requested.
    const productMap = new Map<string, any>();

    rows.forEach(row => {
      const [sku, name, material, color, size, price, stock, category, imagesStr, desc] = row;

      if (!name) return; // Skip empty rows

      if (!productMap.has(name)) {
        // New Product
        productMap.set(name, {
          id: sku || name, // Use SKU of first variant as ID, or just Name
          name: name,
          category: category || 'Uncategorized',
          description: desc || '',
          price: Number(price) || 0, // Base price from first variant
          images: imagesStr ? imagesStr.split(',').map((s: string) => s.trim()) : [],
          variants: [],
          stock: 0 // Aggregate stock
        });
      }

      const product = productMap.get(name);

      // Add Variant
      product.variants.push({
        id: sku,
        material,
        color,
        size,
        price: Number(price) || 0,
        stock: Number(stock) || 0
      });

      // Add to total stock
      product.stock += Number(stock) || 0;
    });

    return Array.from(productMap.values());

  } catch (error: any) {
    console.error('Fetch Products Failed:', error.message);
    // If table doesn't exist, maybe it's old schema?
    // Optionally fallback to old getProducts() logic if needed, but for now we assume migration.
    return [];
  }
}

// Generic Fetch
export async function getSheetData(sheetName: string) {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return [];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:Z`
    });
    return res.data.values || [];
  } catch (e) {
    return [];
  }
}


// --- 5. Data Mocking ---
function getMockProducts() {
  return [
    {
      id: '231-01',
      name: 'Tủ Thờ Chạm Tứ Quý (Mock)',
      category: 'Tủ Thờ',
      description: 'Mock data description.',
      images: ['https://via.placeholder.com/600x400'],
      variants: [
        { id: '231-01', material: 'Gỏ Đỏ', color: 'Tự Nhiên', size: '127x68x127', price: 15000000 },
        { id: '231-02', material: 'Hương Đá', color: 'Nâu', size: '127x68x127', price: 18000000 },
      ],
      price: 15000000,
      stock: 5
    }
  ];
}

// --- 6. Data Access (WRITE) ---

export async function addRowToSheet(sheetName: string, rowValues: any[]) {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return false;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`, // Append to end
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowValues] }
    });
    return true;
  } catch (e) {
    console.error(`Add Row to ${sheetName} failed:`, e);
    return false;
  }
}

export async function updateProduct(id: string, updates: any) {
  // This needs complex logic to find the specific variant row in PROD_VAR
  // For MVP/Demo, logging only
  console.log("Update requested for", id, updates);
  return true;
}

// --- 7. Migration Logic ---
export async function migrateOldData() {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return { success: false, message: "Missing Credentials" };

  try {
    // 1. Read Old Data
    const oldRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Products!A2:J'
    });
    const oldRows = oldRes.data.values;
    if (!oldRows || oldRows.length === 0) return { success: false, message: "Old 'Products' sheet is empty or missing." };

    const newRows: any[] = [];

    // 2. Transform
    oldRows.forEach(row => {
      const [id, name, cat, desc, imgs, varsJSON, price, cost, profit, stock] = row;
      const variants = varsJSON ? safeJSONParse(varsJSON) : [];

      if (variants.length > 0) {
        variants.forEach((v: any) => {
          newRows.push([
            v.id || id, // SKU
            name,
            v.material || '',
            v.color || '',
            v.size || '',
            v.price || price || 0,
            v.stock || 0,
            cat,
            imgs,
            desc
          ]);
        });
      } else {
        newRows.push([
          id, // SKU
          name,
          '', // Material
          '', // Color
          '', // Size
          price || 0,
          stock || 0,
          cat,
          imgs,
          desc
        ]);
      }
    });

    // 3. Write to PROD_VAR
    if (newRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'PROD_VAR!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: newRows }
      });
    }

    return { success: true, message: `Migrated ${newRows.length} rows to PROD_VAR.` };

  } catch (e: any) {
    return { success: false, message: "Migration Failed: " + e.message };
  }
}

// --- 8. Generic CRUD (Update & Delete) ---

export async function updateRow(sheetName: string, id: string, rowValues: any[]) {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return false;

  try {
    // 1. Find Row Index
    // NOTE: This is inefficient for large sheets (O(n)). 
    // For production, we'd cache this or use a more efficient lookup if possible.
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A` // Get just IDs
    });

    const rows = res.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex === -1) return false; // Not found

    const rowNumber = rowIndex + 1; // 1-based index for A1 notation

    // 2. Update Row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowValues] }
    });

    return true;
  } catch (e: any) {
    console.error("Update Row Failed:", e);
    return false;
  }
}

export async function deleteRow(sheetName: string, id: string) {
  const sheets = getSheetsClient();
  if (!sheets || !SPREADSHEET_ID) return false;

  try {
    // 1. Find Row Index (Need index AND SheetId)
    // We need the sheetId (integer) not just name string to delete rows
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheet = meta.data.sheets?.find(s => s.properties?.title === sheetName);

    if (!sheet || typeof sheet.properties?.sheetId !== 'number') return false;

    const sheetId = sheet.properties.sheetId;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`
    });

    const rows = res.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex === -1) return false;

    // 2. Delete Row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1
            }
          }
        }]
      }
    });

    return true;
  } catch (e: any) {
    console.error("Delete Row Failed:", e);
    return false;
  }
}
