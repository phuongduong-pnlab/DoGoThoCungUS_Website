import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet markers not showing in some bundlers
// We'll use a custom icon or ensure the default one loads
// A simple way is to point to the CDN for standard markers if local assets fail, 
// or import them directly. For simplicity and reliability, we'll use an SVG icon logic custom
// or just re-assign the prototypes.
// 
// Actually, let's use a custom DivIcon or standard icon with fixed URLs.
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Customer {
  id: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export default function CustomerMap() {
  const [mounted, setMounted] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Fetch and parse CSV data
    fetch('/data/customers.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const entry: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index];
            // Convert numbers
            if (header === 'id' || header === 'lat' || header === 'lng') {
              entry[header] = parseFloat(value);
            } else {
              entry[header] = value;
            }
          });
          
          return entry as Customer;
        });
        
        setCustomers(parsedData);
      })
      .catch(err => console.error("Error loading customer data:", err));
  }, []);

  if (!mounted) return <div className="map-placeholder" style={{height: '500px', background: '#e5e7eb'}}>Loading Map...</div>;

  return (
    <div className="customer-map-wrapper"> 
      <div className="map-header">
        <h2 className="section-title" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-branding)', fontSize: '2.5rem' }}>Nơi Đồ Gỗ Thờ Cúng US đã được phục vụ</h2>
      </div>
      
      <div className="map-container-inner" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <MapContainer center={[39.8283, -98.5795]} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {customers.map((customer) => (
            <Marker key={customer.id} position={[customer.lat, customer.lng]}>
              <Popup>
                <strong>{customer.city}</strong> <br /> {customer.state}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        .customer-map-wrapper {
          padding: 2rem 0;
        }
        
        .map-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-subtitle {
          color: var(--color-text-muted);
          margin-top: -1rem;
        }
        
        .map-footer p {
          color: var(--color-text-muted);
          font-style: italic;
          margin-top: 1.5rem;
          text-align: center;
        }
        
        /* Custom Marker style can go here if we used DivIcon */
        .leaflet-control-attribution.leaflet-control {
          display: none;
        }
      `}</style>
    </div>
  );
}
