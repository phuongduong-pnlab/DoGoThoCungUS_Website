import React, { useState, useEffect } from 'react';
import '../styles/components/Admin.css';

// --- Generic Table Component ---
const GenericTable = ({ sheetName }: { sheetName: string }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [headers, setHeaders] = useState<string[]>([]);
    const [presets, setPresets] = useState<any>({});
    const [relations, setRelations] = useState<any>({});
    const [relationData, setRelationData] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentRow, setCurrentRow] = useState<any>({});
    const [currentId, setCurrentId] = useState<string | number>('');

    // Sort & Resize State
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
    const isResizing = React.useRef<string | null>(null);
    const startX = React.useRef<number>(0);
    const startWidth = React.useRef<number>(0);

    useEffect(() => {
        // Fetch Schema first to ensure Headers are always correct
        fetch('/api/admin/schema')
            .then(res => res.json())
            .then(data => {
                if (data.schema && data.schema[sheetName]) {
                    setHeaders(data.schema[sheetName]);
                }
                if (data.presets && data.presets[sheetName]) {
                    setPresets(data.presets[sheetName]);
                }
                if (data.relations && data.relations[sheetName]) {
                    setRelations(data.relations[sheetName]);
                    // Fetch data for each relation
                    Object.keys(data.relations[sheetName]).forEach(field => {
                        const rel = data.relations[sheetName][field];
                        fetch(`/api/admin/data?sheet=${rel.table}`)
                            .then(res => res.json())
                            .then(rows => {
                                setRelationData((prev: any) => ({
                                    ...prev,
                                    [field]: rows
                                }));
                            });
                    });
                }
            });
    }, [sheetName]);

    const fetchData = () => {
        setLoading(true);
        fetch(`/api/admin/data?sheet=${sheetName}`)
            .then(res => res.json())
            .then(rows => {
                if (Array.isArray(rows)) {
                    setData(rows);
                } else {
                    setData([]);
                }
            })
            .catch(err => console.error("Failed to load table", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [sheetName]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editMode ? 'PUT' : 'POST';
        
        // Prepare payload
        const body: any = { 
            sheetName, 
            rowValues: { ...currentRow } 
        };
        
        if (editMode) {
            body.id = currentId;
        }

        try {
            const res = await fetch('/api/admin/data', {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            const d = await res.json();
            if (d.success) {
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

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' | null = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
        setSortConfig({ key, direction });
    };

    const startResizing = (e: React.MouseEvent, header: string) => {
        e.preventDefault();
        isResizing.current = header;
        startX.current = e.pageX;
        const th = (e.target as HTMLElement).parentElement;
        startWidth.current = th ? th.offsetWidth : 0;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const diff = e.pageX - startX.current;
        const newWidth = Math.max(50, startWidth.current + diff);
        setColumnWidths(prev => ({ ...prev, [isResizing.current!]: newWidth }));
    };

    const onMouseUp = () => {
        isResizing.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    const openAddModal = () => {
        setEditMode(false);
        const emptyRow: any = {};
        headers.forEach(h => emptyRow[h] = '');
        setCurrentRow(emptyRow);
        setShowModal(true);
    };
    
    const getIdField = () => sheetName === 'products' ? 'sku' : 'id';

    const openEditModal = (row: any) => {
        setEditMode(true);
        const idField = getIdField();
        setCurrentId(row[idField]);
        setCurrentRow({ ...row });
        setShowModal(true);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key || !sortConfig.direction) return 0;
        const aVal = a[sortConfig.key] ?? '';
        const bVal = b[sortConfig.key] ?? '';
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredData = sortedData.filter(row => 
        Object.values(row).some(cell => (cell || '').toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentPageData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sheetName]);

    return (
        <div className="generic-sheet-view">
             <div className="sheet-header">
                <div className="sheet-title">
                    <h3>{sheetName} Management</h3>
                    <button className="refresh-btn" onClick={fetchData} title="Refresh Data" disabled={loading}>
                        <span className={loading ? 'spinning' : ''}>🔄</span>
                    </button>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                <div className="search-wrapper">
                     <input 
                         placeholder="Search..." 
                         value={searchTerm}
                         onChange={e => setSearchTerm(e.target.value)}
                         onFocus={(e) => e.target.select()}
                         className="admin-search"
                     />
                     {searchTerm && (
                         <button 
                             className="search-clear" 
                             onClick={() => setSearchTerm('')}
                             title="Clear Search"
                         >✕</button>
                     )}
                </div>
                     <button className="add-btn" onClick={openAddModal}>Add New Row</button>
                </div>
             </div>
             
             {loading ? <div className="loading">Loading {sheetName}...</div> : (
                 <>
                  <div className="table-container">
                      <table className="admin-table">
                         <thead>
                             <tr>
                                 <th style={{ width: '45px' }}>Actions</th>
                                 {headers.map((h, i) => {
                                     const defaultWidth = h === 'id' || h === 'sku' ? 100 : 
                                                        h === 'name' || h === 'description' ? 250 :
                                                        h === 'category' || h === 'status' ? 150 : 120;
                                     
                                     return (
                                         <th 
                                            key={i} 
                                            style={{ width: columnWidths[h] ? `${columnWidths[h]}px` : `${defaultWidth}px` }}
                                            className="sortable-header"
                                         >
                                        <div className="header-content" onClick={() => handleSort(h)}>
                                            {h.replace('_', ' ')}
                                            <span className={`sort-icon ${sortConfig.key === h ? 'active' : ''}`}>
                                                {sortConfig.key === h ? (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '⇅') : '⇅'}
                                            </span>
                                        </div>
                                        <div className="resize-handle" onMouseDown={(e) => startResizing(e, h)} />
                                     </th>
                                     );
                                 })}
                             </tr>
                         </thead>
                         <tbody>
                             {currentPageData.map((row, i) => (
                                 <tr key={i}>
                                     <td className="actions-cell">
                                         <button className="action-btn" onClick={() => openEditModal(row)}>✏️</button>
                                         <button className="action-btn text-red-600" onClick={() => handleDelete(row[getIdField()])}>🗑️</button>
                                     </td>
                                     {headers.map((h, colIndex) => (
                                         <td key={colIndex} className="table-cell">
                                             <div className="cell-content" title={(row[h] || '').toString()}>
                                                 {Array.isArray(row[h]) ? `[${row[h].length} items]` : (row[h] || '').toString()}
                                                 {sheetName === 'products' && h === 'name' && row.sku && (
                                                     <a 
                                                        href={`/product/${row.sku}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="external-link-icon"
                                                        title="View Product Page"
                                                        onClick={(e) => e.stopPropagation()}
                                                     >
                                                        🔗
                                                     </a>
                                                 )}
                                             </div>
                                         </td>
                                     ))}
                                 </tr>
                             ))}
                             {filteredData.length === 0 && (
                                 <tr><td colSpan={headers.length + 1} style={{textAlign:'center', padding:'20px'}}>No Data Found</td></tr>
                             )}
                         </tbody>
                     </table>
                  </div>
                  <div className="table-footer">
                    <div className="pagination">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="page-btn"
                        >Prev</button>
                        <span className="page-info">Page {currentPage} of {totalPages || 1} ({filteredData.length} records)</span>
                        <button 
                            disabled={currentPage >= totalPages} 
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="page-btn"
                        >Next</button>
                    </div>
                  </div>
                 </>
             )}

             {showModal && (
                 <div className="modal-overlay">
                     <div className="modal-content">
                         <h2>{editMode ? 'Edit Row' : 'Add New Row'}</h2>
                          <form onSubmit={handleSave}>
                              <div className="modal-grid">
                                  {headers.map((h, i) => {
                                     const isId = editMode && h === getIdField();
                                     const presetOptions = presets[h];
                                     const relation = relations[h];
                                     const relData = relationData[h] || [];
                                     
                                     return (
                                         <div key={i} className="form-group">
                                             <label>{h.charAt(0).toUpperCase() + h.slice(1).replace('_', ' ')}</label>
                                             {relation ? (
                                                 <select 
                                                     value={currentRow[h] || ''}
                                                     onChange={e => setCurrentRow({...currentRow, [h]: e.target.value})}
                                                     disabled={isId}
                                                 >
                                                     <option value="">Select {relation.table} ({h})...</option>
                                                     {relData.map((row: any) => (
                                                         <option key={row[relation.key]} value={row[relation.key]}>
                                                             {row[relation.display]} ({row[relation.key]})
                                                         </option>
                                                     ))}
                                                 </select>
                                             ) : presetOptions ? (
                                                 <select 
                                                     value={currentRow[h] || ''}
                                                     onChange={e => setCurrentRow({...currentRow, [h]: e.target.value})}
                                                     disabled={isId}
                                                 >
                                                     <option value="">Select {h}...</option>
                                                     {presetOptions.map((opt: string) => (
                                                         <option key={opt} value={opt}>{opt}</option>
                                                     ))}
                                                 </select>
                                             ) : (
                                                 <input 
                                                     value={currentRow[h] || ''} 
                                                     onChange={e => setCurrentRow({...currentRow, [h]: e.target.value})}
                                                     disabled={isId}
                                                 />
                                             )}
                                         </div>
                                     );
                                 })}
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('PRODUCTS'); // PRODUCTS, ORDERS, CUSTOMERS, SETTINGS
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check Keep-Alive
  useEffect(() => {
    fetch('/api/auth/check')
        .then(res => {
            if (res.ok) {
                setIsAuthenticated(true);
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
        } else alert('Invalid Password');
    } catch { alert('Login failed'); }
  };
  
  const handleLogout = async () => {
      await fetch('/api/auth/check', { method: 'POST' });
      setIsAuthenticated(false);
  };

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
    <div className={`admin-dashboard-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar">
            <div className="sidebar-header">
                {!sidebarCollapsed && <span>Admin</span>}
                <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                    {sidebarCollapsed ? '→' : '←'}
                </button>
            </div>
            <nav title={sidebarCollapsed ? "Menu" : ""}>
                <button className={activeTab === 'PRODUCTS' ? 'active' : ''} onClick={() => setActiveTab('PRODUCTS')} title="Products">
                    <span className="nav-icon">📦</span>
                    {!sidebarCollapsed && <span>Products (Raw)</span>}
                </button>
                <button className={activeTab === 'ORDERS' ? 'active' : ''} onClick={() => setActiveTab('ORDERS')} title="Orders">
                    <span className="nav-icon">🧾</span>
                    {!sidebarCollapsed && <span>Orders</span>}
                </button>
                <button className={activeTab === 'CUSTOMERS' ? 'active' : ''} onClick={() => setActiveTab('CUSTOMERS')} title="Customers">
                    <span className="nav-icon">👤</span>
                    {!sidebarCollapsed && <span>Customers</span>}
                </button>
                <button className={activeTab === 'INVENTORY' ? 'active' : ''} onClick={() => setActiveTab('INVENTORY')} title="Inventory">
                    <span className="nav-icon">📊</span>
                    {!sidebarCollapsed && <span>Inventory</span>}
                </button>
                
                <div className="divider"></div>
                {!sidebarCollapsed && <div className="nav-label">Finance & Ops</div>}
                
                <button className={activeTab === 'BUSINESS' ? 'active' : ''} onClick={() => setActiveTab('BUSINESS')} title="Business">
                    <span className="nav-icon">📈</span>
                    {!sidebarCollapsed && <span>Business</span>}
                </button>
                <button className={activeTab === 'DEBTS' ? 'active' : ''} onClick={() => setActiveTab('DEBTS')} title="Debts">
                    <span className="nav-icon">💰</span>
                    {!sidebarCollapsed && <span>Debts</span>}
                </button>
                <button className={activeTab === 'SUPPLIERS' ? 'active' : ''} onClick={() => setActiveTab('SUPPLIERS')} title="Suppliers">
                    <span className="nav-icon">🏭</span>
                    {!sidebarCollapsed && <span>Suppliers</span>}
                </button>
                
                <div className="divider"></div>
                {!sidebarCollapsed && <div className="nav-label">Logistics</div>}
                
                <button className={activeTab === 'SHIPPING' ? 'active' : ''} onClick={() => setActiveTab('SHIPPING')} title="Shipping">
                    <span className="nav-icon">🚚</span>
                    {!sidebarCollapsed && <span>Shipping</span>}
                </button>
                <button className={activeTab === 'WARRANTY' ? 'active' : ''} onClick={() => setActiveTab('WARRANTY')} title="Warranty">
                    <span className="nav-icon">🛡️</span>
                    {!sidebarCollapsed && <span>Warranty</span>}
                </button>
                
                <div className="divider"></div>
                <button className={activeTab === 'SETTINGS' ? 'active' : ''} onClick={() => setActiveTab('SETTINGS')} title="Settings">
                    <span className="nav-icon">⚙️</span>
                    {!sidebarCollapsed && <span>Settings</span>}
                </button>
            </nav>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
                <span className="nav-icon">🚪</span>
                {!sidebarCollapsed && <span>Logout</span>}
            </button>
        </div>

        <div className="main-content">
            {activeTab === 'PRODUCTS' && <GenericTable sheetName="products" />}

            {activeTab === 'ORDERS' && <GenericTable sheetName="orders" />}
            {activeTab === 'CUSTOMERS' && <GenericTable sheetName="customers" />}
            {activeTab === 'INVENTORY' && <GenericTable sheetName="inventory_logs" />}
            
            {activeTab === 'BUSINESS' && <GenericTable sheetName="business_activities" />}
            {activeTab === 'DEBTS' && <GenericTable sheetName="debts" />}
            {activeTab === 'SUPPLIERS' && <GenericTable sheetName="suppliers" />}
            
            {activeTab === 'SHIPPING' && <GenericTable sheetName="shipping" />}
            {activeTab === 'WARRANTY' && <GenericTable sheetName="warranty" />}
            
            {activeTab === 'DISCOUNTS' && <GenericTable sheetName="discounts" />}
            {activeTab === 'REVIEWS' && <GenericTable sheetName="reviews" />}
            
            {activeTab === 'SETTINGS' && (
                <div className="settings-panel">
                    <h2>System Settings</h2>
                    <div className="setting-card">
                        <h3>Database Status</h3>
                        <p>The system is currently using Supabase as the primary database.</p>
                        <div className="status-badge success">Connected</div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
