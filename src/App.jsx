import React, { useState, useEffect } from 'react';
import { db } from './Firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import './App.css'; // Importamos los estilos optimizados

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoAbierto, setProductoAbierto] = useState(null);

  useEffect(() => {
    const qCat = query(collection(db, "categorias"), orderBy("nombre", "asc"));
    const unsubscribeCat = onSnapshot(qCat, (snap) => {
      setCategorias(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubscribeProd = onSnapshot(collection(db, "productos"), (snap) => {
      setProductos(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubscribeCat();
      unsubscribeProd();
    };
  }, []);

  const toggleProducto = (id) => {
    setProductoAbierto(productoAbierto === id ? null : id);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo-text">INKIER</h1>
        <p className="sub-text">PARADOR</p>
      </header>

      <main className="main-content">
        {categorias.map(cat => (
          <section key={cat.id} className="menu-section">
            <div className="category-container">
              <div className="category-pill">{cat.nombre}</div>
            </div>
            
            <div className="menu-list">
              {productos.filter(p => p.categoria === cat.nombre).map(p => (
                <div key={p.id} className="item-container">
                  <div 
                    className="product-card"
                    style={{ backgroundColor: productoAbierto === p.id ? 'rgba(255,255,255,0.8)' : 'transparent' }}
                  >
                    <div 
                      className="product-bar"
                      style={{ backgroundColor: productoAbierto === p.id ? 'var(--turquesa-logo)' : 'var(--blanco)' }}
                      onClick={() => toggleProducto(p.id)}
                    >
                      <span 
                        className="item-name"
                        style={{ color: productoAbierto === p.id ? 'var(--blanco)' : 'var(--turquesa-logo)' }}
                      >
                        {p.nombre}
                      </span>
                      <span 
                        className="item-price"
                        style={{ color: productoAbierto === p.id ? 'var(--blanco)' : 'var(--turquesa-logo)' }}
                      >
                        ${p.precio}
                      </span>
                    </div>

                    {productoAbierto === p.id && (
                      <div className="item-detail">
                        <div className="description-col">
                          <p className="item-description">{p.descripcion || "Elaboración artesanal."}</p>
                        </div>
                        <div className="image-col">
                          {p.imagen && <img src={p.imagen} alt={p.nombre} className="item-image" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="footer">
        <p>Parador Inkier - Colón, Entre Ríos 🌴</p>
      </footer>
    </div>
  );
}

export default App;