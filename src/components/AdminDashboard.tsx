import React, { useState, useEffect } from 'react';
import '../styles/components/Admin.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number | string;
  description: string;
  variants: any[];
  // Admin fields
  cost?: number;
  profit?: number;
  stock?: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple client-side auth for demo purposes
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Replace with env var or better auth
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      alert('Invalid Password');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // In a real app, send token in header
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }
    const lower = search.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.category.toLowerCase().includes(lower) ||
      p.id.includes(lower)
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const handleQuickCopy = (product: Product) => {
    // Generate attractive lead
    const variantsText = product.variants && product.variants.length 
        ? product.variants.map(v => `${v.size || ''} ${v.color || ''}`).join(', ')
        : 'Standard';

    const text = `
✨ ${product.name} ✨
Category: ${product.category}

📏 Options: ${variantsText}
💰 Price: $${product.price} (Limited Time!)

${product.description}

🔥 Hot Deal! Stock is running low.
📩 Check it out here: ${window.location.origin}/products/${product.id}
    `.trim();

    navigator.clipboard.writeText(text);
    alert('Lead copied to clipboard!');
  };

  const handleUpdate = async (id: string, field: string, value: any) => {
      // Optimistic Update
      const newProducts = products.map(p => p.id === id ? { ...p, [field]: value } : p);
      setProducts(newProducts);
      setFilteredProducts(newProducts); // Re-filter if needed

      try {
          await fetch('/api/products?admin=true', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, [field]: value })
          });
      } catch (e) {
          alert("Update failed!");
          fetchProducts(); // Revert
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Admin Access</h2>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Enter Password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Product Management</h1>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-search"
        />
        <button className="refresh-btn" onClick={fetchProducts}>Refresh Data</button>
      </div>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <a href={`/products/${product.id}`} target="_blank" rel="noreferrer">
                        {product.name}
                    </a>
                  </td>
                  <td>{product.category}</td>
                  <td>
                      <input 
                        type="number" 
                        value={product.price} 
                        className="edit-input"
                        onChange={(e) => handleUpdate(product.id, 'price', e.target.value)}
                      />
                  </td>
                  <td className="text-red-600">${product.cost || '-'}</td>
                  <td className="text-green-600">${product.profit || '-'}</td>
                  <td>
                      <input 
                        type="number" 
                        value={product.stock || 0} 
                        className="edit-input w-20"
                        onChange={(e) => handleUpdate(product.id, 'stock', e.target.value)}
                      />
                  </td>
                  <td>
                    <button 
                        onClick={() => handleQuickCopy(product)}
                        className="action-btn copy-btn"
                    >
                        Copy Lead
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && <div className="no-results">No products found.</div>}
        </div>
      )}
    </div>
  );
}
