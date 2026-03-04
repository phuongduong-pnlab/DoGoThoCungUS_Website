import type { APIRoute } from "astro";
import fs from "fs";
import path from "path";
import { getTableData } from "../../../lib/server/supabase";
import { log } from "console";

export const POST: APIRoute = async () => {
    try {
        const customers = await getTableData('customers');

        const csvPath = path.join(process.cwd(), 'public', 'data', 'customers.csv');
        let existingCsv = '';
        if (fs.existsSync(csvPath)) {
            existingCsv = fs.readFileSync(csvPath, 'utf8');
        } else {
            existingCsv = 'id,city,state,lat,lng\n';
        }

        const existingLines = existingCsv.split('\n').filter(l => l.trim().length > 0);
        let maxId = 0;
        const existingLocations = new Set<string>();

        for (let i = 1; i < existingLines.length; i++) {
            const cols = existingLines[i].split(',');
            if (cols.length >= 3) {
                const id = parseInt(cols[0], 10);
                if (!isNaN(id) && id > maxId) maxId = id;
                const city = cols[1].trim().toLowerCase();
                const state = cols[2].trim().toLowerCase();
                existingLocations.add(`${city},${state}`);
            }
        }

        let newRecordsAdded = 0;

        for (const customer of customers) {
            if (!customer.address) continue;


            // Try to extract city and state.
            // Expected format: "123 Main St, City Name, ST 12345"
            let city = '';
            let state = '';

            const stateZipMatch = customer.address.match(/\b([A-Z]{2})\s+\d{5}(?:-\d{4})?\b/i);
            if (stateZipMatch) {
                state = stateZipMatch[1].toUpperCase();
                const preStateText = customer.address.substring(0, stateZipMatch.index);
                const tokens = preStateText.split(',');
                if (tokens.length >= 2) {
                    city = tokens[tokens.length - 2].trim();
                }
            }

            if (!city || !state) continue;

            const locKey = `${city.toLowerCase()},${state.toLowerCase()}`;
            if (existingLocations.has(locKey)) continue;

            const query = `${encodeURIComponent(city)}, ${encodeURIComponent(state)}, USA`;
            const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

            try {
                const res = await fetch(url, {
                    headers: {
                        'User-Agent': 'DogothocungAdmin/1.0 (contact@dogothocung.com)'
                    }
                });
                const data = await res.json();

                if (data && data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;

                    maxId++;
                    const newLine = `${maxId === 1 && existingLines.length === 0 ? 'id,city,state,lat,lng\n' : ''}${maxId},${city},${state},${lat},${lon}\n`;
                    fs.appendFileSync(csvPath, newLine, 'utf8');

                    existingLocations.add(locKey);
                    newRecordsAdded++;

                    // Respect Nominatim's 1 req/sec limit
                    await new Promise(resolve => setTimeout(resolve, 1100));
                }
            } catch (err) {
                console.error("Geocoding error for", city, state, err);
            }
        }

        return new Response(JSON.stringify({ success: true, added: newRecordsAdded }), { status: 200 });

    } catch (e: any) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
}
