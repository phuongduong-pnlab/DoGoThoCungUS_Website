import React, { useState, useEffect } from 'react';
import '../styles/components/Admin.css';

// --- Generic Table Component ---
// --- Generic Table Component ---
const GenericTable = ({ sheetName }: { sheetName: string }) => {
    const [data, setData] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);
    const [headers, setHeaders] = useState<string[]>([]);
    const [schemaHeaders, setSchemaHeaders] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentRow, setCurrentRow] = useState<string[]>([]);
    const [currentId, setCurrentId] = useState('');

    useEffect(() => {
        // Fetch Schema first to ensure Headers are always correct
        fetch('/api/admin/schema')
            .then(res => res.json())
            .then(schema => {
                if (schema[sheetName]) {
                    setSchemaHeaders(schema[sheetName]);
                    setHeaders(schema[sheetName]);
                }
            });
    }, [sheetName]);

    const fetchData = () => {
        setLoading(true);
        fetch(`/api/admin/data?sheet=${sheetName}`)
            .then(res => res.json())
            .then(rows => {
                // If API returns headers in row 0, we can skip it if we have schema
                // But usually row 0 is headers in Sheet.
                if (Array.isArray(rows) && rows.length > 0) {
                    setData(rows);
                } else {
                    setData([]);
                }
            })
            .catch(err => console.error("Failed to load sheet", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [sheetName]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editMode ? 'PUT' : 'POST';
        const body: any = { sheetName, rowValues: currentRow };
        if (editMode) body.id = currentId;

        try {
            const res = await fetch('/api/admin/data', {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            const d = await res.json();
            if (d.success) {
                alert('Saved successfully');
                setShowModal(false);
                fetchData();
            } else {
                alert('Error: ' + d.error);
            }
        } catch(err) { alert('Failed to save'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(`Are you sure you want to delete ID: ${id}?`)) return;
        try {
            const res = await fetch(`/api/admin/data?sheet=${sheetName}&id=${id}`, { method: 'DELETE' });
            const d = await res.json();
            if (d.success) {
                fetchData();
            } else {
                alert('Delete Failed: ' + d.error);
            }
        } catch(err) { alert('Delete failed'); }
    }

    const openAddModal = () => {
        setEditMode(false);
        setCurrentRow(new Array(headers.length).fill(''));
        setShowModal(true);
    };

    const openEditModal = (row: string[]) => {
        setEditMode(true);
        setCurrentId(row[0]); // Assume ID is Col 0
        setCurrentRow([...row]);
        setShowModal(true);
    };

    const filteredData = data.filter(row => 
        row.some(cell => (cell || '').toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="generic-sheet-view">
             <div className="sheet-header">
                <h3>{sheetName} Management</h3>
                <div style={{display:'flex', gap:'10px'}}>
                     <input 
                         placeholder="Search..." 
                         value={searchTerm}
                         onChange={e => setSearchTerm(e.target.value)}
                         className="admin-search"
                         style={{width: '200px'}}
                     />
                     <button className="add-btn" onClick={openAddModal}>Add New Row</button>
                </div>
             </div>
             
             {loading ? <div className="loading">Loading {sheetName}...</div> : (
                 <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {headers.map((h, i) => <th key={i}>{h}</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, i) => (
                                <tr key={i}>
                                    {headers.map((_, colIndex) => (
                                        <td key={colIndex}>{row[colIndex] || ''}</td>
                                    ))}
                                    <td>
                                        <button className="action-btn" onClick={() => openEditModal(row)}>✏️</button>
                                        <button className="action-btn text-red-600" onClick={() => handleDelete(row[0])}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr><td colSpan={headers.length + 1} style={{textAlign:'center', padding:'20px'}}>No Data Found</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
             )}

             {showModal && (
                 <div className="modal-overlay">
                     <div className="modal-content">
                         <h2>{editMode ? 'Edit Row' : 'Add New Row'}</h2>
                         <form onSubmit={handleSave}>
                             <div className="modal-grid">
                                {headers.map((h, i) => (
                                    <div key={i} className="form-group">
                                        <label>{h}</label>
                                        <input 
                                            value={currentRow[i] || ''} 
                                            onChange={e => {
                                                const newRow = [...currentRow];
                                                newRow[i] = e.target.value;
                                                setCurrentRow(newRow);
                                            }}
                                            disabled={editMode && i === 0} // Disable ID edit
                                        />
                                    </div>
                                ))}
                             </div>
                             <div className="modal-actions">
                                 <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                 <button type="submit" className="save-btn">{editMode ? 'Update' : 'Create'}</button>
                             </div>
                         </form>
                     </div>
                 </div>
             )}
        </div>
    );
};

interface Product {
  id: string;
  name: string;
  category: string;
  price: number | string;
  description: string;
  variants: any[];
  cost?: number;
  stock?: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('PRODUCTS'); // PRODUCTS, ORDERS, CUSTOMERS, SETTINGS
  
  // Product State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Init DB State
  const [initStatus, setInitStatus] = useState('');

  // Check Keep-Alive
  useEffect(() => {
    fetch('/api/auth/check')
        .then(res => {
            if (res.ok) {
                setIsAuthenticated(true);
                fetchProducts();
            }
        })
        .catch(() => {})
        .finally(() => setAuthLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setIsAuthenticated(true);
            fetchProducts();
        } else alert('Invalid Password');
    } catch { alert('Login failed'); }
  };
  
  const handleLogout = async () => {
      await fetch('/api/auth/check', { method: 'POST' });
      setIsAuthenticated(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setFilteredProducts(data);
      }
    } catch (e) {
        console.warn("Using mock data");
    } finally {
      setLoading(false);
    }
  };

  const initDatabase = async () => {
      if(!confirm("This will create specific tabs in your Google Sheet if they don't exist. Continue?")) return;
      setInitStatus('Initializing...');
      try {
          const res = await fetch('/api/admin/init-db', { method: 'POST' });
          const data = await res.json();
          if(data.success) alert("Success: " + data.message);
          else alert("Error: " + data.message);
      } catch (e) {
          alert("Failed to connect to init-db endpoint");
      } finally {
          setInitStatus('');
      }
  };

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredProducts(products.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.id.toLowerCase().includes(lower)
    ));
  }, [search, products]);

  if (authLoading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Admin Access</h2>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
          <button type="submit">Login</button>
        </form>
      </div>
  );

  return (
    <div className="admin-dashboard-layout">
        <div className="sidebar">
            <div className="sidebar-header">Admin</div>
            <nav>
                <button className={activeTab === 'PRODUCTS' ? 'active' : ''} onClick={() => setActiveTab('PRODUCTS')}>Products (Raw)</button>
                <button className={activeTab === 'ORDERS' ? 'active' : ''} onClick={() => setActiveTab('ORDERS')}>Orders</button>
                <button className={activeTab === 'CUSTOMERS' ? 'active' : ''} onClick={() => setActiveTab('CUSTOMERS')}>Customers</button>
                <button className={activeTab === 'INVENTORY' ? 'active' : ''} onClick={() => setActiveTab('INVENTORY')}>Inventory</button>
                
                <div className="divider"></div>
                <div className="nav-label">Finance & Ops</div>
                <button className={activeTab === 'BUSINESS' ? 'active' : ''} onClick={() => setActiveTab('BUSINESS')}>Business Activities</button>
                <button className={activeTab === 'DEBTS' ? 'active' : ''} onClick={() => setActiveTab('DEBTS')}>Debts (Công Nợ)</button>
                <button className={activeTab === 'SUPPLIERS' ? 'active' : ''} onClick={() => setActiveTab('SUPPLIERS')}>Suppliers</button>
                
                <div className="divider"></div>
                <div className="nav-label">Logistics & Support</div>
                <button className={activeTab === 'SHIPPING' ? 'active' : ''} onClick={() => setActiveTab('SHIPPING')}>Shipping</button>
                <button className={activeTab === 'WARRANTY' ? 'active' : ''} onClick={() => setActiveTab('WARRANTY')}>Warranty</button>
                
                <div className="divider"></div>
                <div className="nav-label">Marketing</div>
                <button className={activeTab === 'DISCOUNTS' ? 'active' : ''} onClick={() => setActiveTab('DISCOUNTS')}>Discounts</button>
                <button className={activeTab === 'REVIEWS' ? 'active' : ''} onClick={() => setActiveTab('REVIEWS')}>Reviews</button>

                <div className="divider"></div>
                <button className={activeTab === 'SETTINGS' ? 'active' : ''} onClick={() => setActiveTab('SETTINGS')}>Settings</button>
            </nav>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="main-content">
            {activeTab === 'PRODUCTS' && <GenericTable sheetName="PROD_VAR" />}

            {activeTab === 'ORDERS' && <GenericTable sheetName="ORDERS" />}
            {activeTab === 'CUSTOMERS' && <GenericTable sheetName="CUSTOMERS" />}
            {activeTab === 'INVENTORY' && <GenericTable sheetName="INVENTORY_LOG" />}
            
            {activeTab === 'BUSINESS' && <GenericTable sheetName="BUSINESS_ACTIVITIES" />}
            {activeTab === 'DEBTS' && <GenericTable sheetName="DEBTS" />}
            {activeTab === 'SUPPLIERS' && <GenericTable sheetName="SUPPLIERS" />}
            
            {activeTab === 'SHIPPING' && <GenericTable sheetName="SHIPPING" />}
            {activeTab === 'WARRANTY' && <GenericTable sheetName="WARRANTY" />}
            
            {activeTab === 'DISCOUNTS' && <GenericTable sheetName="DISCOUNTS" />}
            {activeTab === 'REVIEWS' && <GenericTable sheetName="REVIEWS" />}
            
            {activeTab === 'SETTINGS' && (
                <div className="settings-panel">
                    <h2>System Settings</h2>
                    <div className="setting-card">
                        <h3>Google Sheets Database</h3>
                        <p>Ensure your connected sheet has the correct structure (Tabs for Orders, Customers, Products, etc).</p>
                        <div style={{display:'flex', gap:'10px'}}>
                             <button className="primary-btn" onClick={initDatabase} disabled={!!initStatus}>
                                {initStatus || "Initialize Database Structure"}
                            </button>
                             <button className="primary-btn" style={{background:'#f59e0b'}} onClick={async () => {
                                 if(!confirm("Attempt to migrate data from 'Products' (old) to 'PROD_VAR' (new)?")) return;
                                 try {
                                     const res = await fetch('/api/admin/migrate', {method:'POST'});
                                     const d = await res.json();
                                     alert(d.message);
                                 } catch(e) { alert("Migration failed"); }
                             }}>
                                Migrate Old Data
                            </button>
                        </div>
                        <p className="hint">1. Initialize First. 2. Migrate if you have existing data in the 'Products' tab.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
