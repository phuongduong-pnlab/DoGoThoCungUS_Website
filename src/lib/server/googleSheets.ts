/// <reference types="astro/client" />
import { google } from 'googleapis';

const SPREADSHEET_ID = import.meta.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

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

function safeJSONParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return [];
  }
}

export async function getProducts() {
  const auth = getAuth();

  if (!auth || !SPREADSHEET_ID) {
    return getMockProducts();
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });

    console.log("Fetching range from Sheets:", SPREADSHEET_ID);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Products!A2:J', // Adjust range as needed
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found in sheet.");
      return [];
    }

    return rows
      .filter(row => row && row[0]) // Filter rows without ID
      .map(row => ({
        id: row[0],
        name: row[1] || 'Untitled',
        category: row[2] || 'Uncategorized',
        description: row[3] || '',
        images: row[4] ? row[4].split(',') : [],
        variants: row[5] ? safeJSONParse(row[5]) : [],
        price: row[6] || 0,
        cost: row[7],
        profit: row[8],
        stock: row[9],
      }));
  } catch (error: any) {
    console.error('CRITICAL: Error fetching from Sheets:', error.message);
    if (error.response) {
      console.error('Gaxios Error details:', error.response.data);
    }
    return [];
  }
}

// Mock Data for Demo/Dev
function getMockProducts() {
  return [
    {
      id: '1',
      name: 'Luxury Teak Sofa',
      category: 'Furniture',
      description: 'Handcrafted teak wood sofa with premium cushioning.',
      images: ['https://via.placeholder.com/600x400?text=Sofa'],
      variants: [
        { size: '3-Seater', color: 'Beige', price: 1200 },
        { size: '2-Seater', color: 'Beige', price: 900 }
      ],
      price: 1200,
      cost: 600,
      profit: 600,
      stock: 5
    },
    // ... more items
  ];
}

export async function updateProduct(id: string, updates: any) {
  const auth = getAuth();
  if (!auth || !SPREADSHEET_ID) {
    console.log("Mock update for", id, updates);
    return true; // Mock success
  }

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // 1. Find row index (inefficient but simple for small sheets)
    const products = await getProducts();
    const rowIndex = products.findIndex(p => p.id === id);

    if (rowIndex === -1) return false;

    // Row number is index + 2 (header + 1-based)
    const rowNumber = rowIndex + 2;
    const range = `Products!A${rowNumber}:J${rowNumber}`; // Assuming columns match

    // We need to fetch the existing row first to merge, or just update specific cells if we map them.
    // For simplicity, we will just update Stock (Col J) or Price (Col G) if passed.
    // Better strategy: Use valueInputOption: "USER_ENTERED" and update specific columns?
    // Let's assume we pass the FULL object back or robustly map updates.
    // For this MVP, let's just support Stock Update (Col J is index 9 => 'J')

    const requests = [];
    if (updates.stock !== undefined) {
      requests.push(sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Products!J${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[updates.stock]] }
      }));
    }

    if (updates.price !== undefined) {
      requests.push(sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Products!G${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[updates.price]] }
      }));
    }

    await Promise.all(requests);
    return true;
  } catch (e) {
    console.error("Update failed", e);
    return false;
  }
}
