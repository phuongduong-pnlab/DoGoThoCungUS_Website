import { google } from 'googleapis';

const SPREADSHEET_ID = "1FYEktWMUh9hPNzvLkkTsVkHXYcwZBnlGHUtJAxyC-YM";
const CLIENT_EMAIL = "dogothocungus-website-bot@dogothocungus-website.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiea5Mz4v0b61b\nhfO/a1B37yQiFwKgrHLWl2WcXwPePEctP+rPscLVhNeSPPpPy69vCkfyUCFMsa6R\nPuLmJEcJ1O95YkUyi083KiJsckndBwFpCy0zVPpg+35RouH1N5bsATdE0aHRN6eQ\n5u1IwLWaZJ/iLI6HBiEvrmvFj4Ge74k/1olsQWN28j7hInDDfqx+MtYoIllGxgka\n98t81zXrUW0Zk++2eA5iKEP9RxksyrZsx9rpa+DUI33vmT5wLGNQg5aJvEOeZjp8\nlFNhUrOihyNV6X5Jsnp8sTzOHfLVwgCiBrQCsmSBGbOIgt21WHDyY8ufA0suC9tH\n8rhyVVhjAgMBAAECggEADypwHIo8mqu6Zc5iMknUM5T9HmAlYNQSVp23hCPRkv4q\nyk+3gHiaRK2v3Zgv5hVVpl1Iq61DSir8ttv3R+/tQi4TIUNpwUbNWkVpsEmQ+fgy\ne+imnwNw2R+XZ9bPaKx0F1Iy86Oa+DxQyVzul0qw7EUSm4vL3iRwAp8u26Xg25YH\niZpGCVx2rPBxOQ/lGjHhz/Cp2y8F6Gyvu0AoU3Q0DsBqOM3ml90z5OE/C7y39qos\nJb8d4GGRSJeYMUAMSHzGvJzjetPR+4nkIeEiJkjHCYnuDh6pTdQlFBPjYSAdwITz\nY1yXPmAKYw+zi10mVIB/kN1NLLYoPNewmlhe6RgL5QKBgQD7GFLN5PKO+UmTRGC5\nyBMxkacUbDC3TxpEWFmKeqw2jv/LIR3JgGeMSu5TWFrANNePdqUQTNpgxMzGPDfH\n0oXQkEqCkJTvKTgkzSPHYZtb3aiG+oG6T/2ladYYfXPLW2TDqHX2kgaPpdD5v4Wp\nhxgNSqCtohM2HISe7HGz+le+9QKBgQDm5j05vl6ZNcHgjYmeXFCkh4+9SwtfbP80\nN1w5vVWDRxu7H7/jKuwip3UcLHSiNA2ryf32y1mbsz0wW5joBS7akZQzRt0xNDv5\neWIjF8hVB5/jv7MMRDh8T+cegY03S3lWxdvv0glQjYN25RgN+PIbgIMg3t1itGi0\nxBQs1jdy9wKBgQCcCBhkk7HbALQkzGfi6p5qvhz6RuTa9E/ZSqGRuPtNB/2SJ6kP\n7zfpaSLCLfRu3idZohuejnNhkMnDIeZzyLGY0iFLEzdJiu61h7iFDHVzV8GC5yY4\nNb7jzGnbXBHZu5hZMVTkfQeQujSrDcWsfCOJFufUHhQcGwqai0l40sc2BQKBgQCP\nyPJ5geXQzJwV5K29Msl5G33UJ+ZGH07wykShJBkbLe3D4iqRIQp5LgSMbdaXp4iX\n4KpIxCrh/YTuFywp2AhsTVmXcNqPKHLskL0fE1FKOfxES/0Id3chWnSXF5/Dvjkq\nYv3p4sawJd+m61TGZq8Fl0qQ7pe4PpYxcyUJIsDW0wKBgDQ8GGVnbpC7PU3VKnEQ\n5VB41eVdtjbgWbhCKK56bfv9E+RYU6Z+H8s+IKQ6S1uUVOlObuxHtW2xGv1LJezq\n9uYGKr9ahtoRkOMwiovxG73y3B2I9ugjiPV3X7wJOCZRMTvJnd6L2SrwG+SZzFGI\nSt+NXeCv7dFCDQ+SEdZlW4k4\n-----END PRIVATE KEY-----\n"?.replace(/\\n/g, "\n");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
function getAuth() {
  if (!PRIVATE_KEY) {
    console.warn("Missing Google Credentials, using Mock Data.");
    return null;
  }
  return new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: SCOPES
  });
}
function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return [];
  }
}
async function getProducts() {
  const auth = getAuth();
  if (!auth || !SPREADSHEET_ID) {
    return getMockProducts();
  }
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Products!A2:J"
      // Adjust range as needed
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];
    return rows.filter((row) => row[0]).map((row) => ({
      id: row[0],
      name: row[1] || "Untitled",
      category: row[2] || "Uncategorized",
      description: row[3] || "",
      images: row[4] ? row[4].split(",") : [],
      variants: row[5] ? safeJSONParse(row[5]) : [],
      price: row[6] || 0,
      cost: row[7],
      profit: row[8],
      stock: row[9]
    }));
  } catch (error) {
    console.error("Error fetching from Sheets:", error);
    return [];
  }
}
function getMockProducts() {
  return [
    {
      id: "1",
      name: "Luxury Teak Sofa",
      category: "Furniture",
      description: "Handcrafted teak wood sofa with premium cushioning.",
      images: ["https://via.placeholder.com/600x400?text=Sofa"],
      variants: [
        { size: "3-Seater", color: "Beige", price: 1200 },
        { size: "2-Seater", color: "Beige", price: 900 }
      ],
      price: 1200,
      cost: 600,
      profit: 600,
      stock: 5
    }
    // ... more items
  ];
}
async function updateProduct(id, updates) {
  const auth = getAuth();
  if (!auth || !SPREADSHEET_ID) {
    console.log("Mock update for", id, updates);
    return true;
  }
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const products = await getProducts();
    const rowIndex = products.findIndex((p) => p.id === id);
    if (rowIndex === -1) return false;
    const rowNumber = rowIndex + 2;
    const range = `Products!A${rowNumber}:J${rowNumber}`;
    const requests = [];
    if (updates.stock !== void 0) {
      requests.push(sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Products!J${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[updates.stock]] }
      }));
    }
    if (updates.price !== void 0) {
      requests.push(sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Products!G${rowNumber}`,
        valueInputOption: "USER_ENTERED",
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

export { getProducts, updateProduct };
