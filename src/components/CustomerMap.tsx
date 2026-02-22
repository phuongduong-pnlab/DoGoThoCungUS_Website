import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";

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
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Dynamically import Leaflet and React-Leaflet only on the client
    // This circumvents Vite/Astro SSR and prebundling crashes associated with Leaflet's window dependency
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([ReactLeaflet, Leaflet]) => {
      const L = Leaflet.default || Leaflet;
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      setMapComponents({
        MapContainer: ReactLeaflet.MapContainer,
        TileLayer: ReactLeaflet.TileLayer,
        Marker: ReactLeaflet.Marker,
        Popup: ReactLeaflet.Popup,
        DefaultIcon
      });
    }).catch(err => console.error("Error dynamically loading Leaflet:", err));

    // Fetch and parse CSV data
    fetch('/data/customers.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.replace(/\r/g, '').trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const entry: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index];
            if (header === 'id' || header === 'lat' || header === 'lng') {
              entry[header] = parseFloat(value);
            } else {
              entry[header] = value;
            }
          });
          
          return entry;
        }).filter(customer => !isNaN(customer.lat) && !isNaN(customer.lng));
        
        setCustomers(parsedData as Customer[]);
      })
      .catch(err => console.error("Error loading customer data:", err));
  }, []);

  if (!mounted || !MapComponents) {
    return (
      <div className="customer-map-wrapper"> 
        <div className="map-header">
          <h2 className="section-title" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-branding)', fontSize: '2.5rem' }}>Nơi Đồ Gỗ Thờ Cúng US đã được phục vụ</h2>
        </div>
        <div className="map-placeholder" style={{height: '500px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'}}>
          Loading Map...
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, DefaultIcon } = MapComponents;

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
            <Marker key={customer.id} position={[customer.lat, customer.lng]} icon={DefaultIcon}>
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
        
        .leaflet-control-attribution.leaflet-control {
          display: none;
        }
      `}</style>
    </div>
  );
}
