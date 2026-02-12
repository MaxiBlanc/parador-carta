import React, { useState, useEffect } from 'react';
import { db } from './Firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import './App.css';

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoAbierto, setProductoAbierto] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  
  // Estado para manejar qué categoría está seleccionada y visible
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  useEffect(() => {
    // 1. Escuchar Categorías
    const unsubscribeCat = onSnapshot(collection(db, "categorias"), (snap) => {
      const listaCat = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      listaCat.sort((a, b) => (a.nro || 0) - (b.nro || 0));
      setCategorias(listaCat);
      
      // Si no hay categoría activa, seleccionamos la primera por defecto
      if (listaCat.length > 0 && !categoriaActiva) {
        setCategoriaActiva(listaCat[0].nombre);
      }
    });

    // 2. Escuchar Productos
    const unsubscribeProd = onSnapshot(collection(db, "productos"), (snap) => {
      const listaProd = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      listaProd.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProductos(listaProd);
    });

    return () => {
      unsubscribeCat();
      unsubscribeProd();
    };
  }, [categoriaActiva]);

  const toggleProducto = (id) => {
    setProductoAbierto(productoAbierto === id ? null : id);
  };

  return (
    <div className="app-container">
      {/* MODAL DE IMAGEN AMPLIA */}
      {imagenAmpliada && (
        <div className="modal-overlay" onClick={() => setImagenAmpliada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={imagenAmpliada} className="image-full" alt="Zoom" />
          </div>
          <button className="close-button" onClick={() => setImagenAmpliada(null)}>
            Cerrar
          </button>
        </div>
      )}

      <header className="header">
        <img src="/vite.jpeg" alt="Logo Parador Inkier" className="header-logo" />
      </header>

      {/* NAV DE CATEGORÍAS DESLIZABLE */}
      <nav className="categories-nav">
        {categorias.map(cat => (
          <button 
            key={cat.id} 
            className={`category-item ${categoriaActiva === cat.nombre ? 'active' : ''}`}
            onClick={() => {
              setCategoriaActiva(cat.nombre);
              setProductoAbierto(null); // Cerramos cualquier acordeón al cambiar de categoría
            }}
          >
            {cat.nombre}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <section className="menu-section">
          <div className="menu-list">
            {productos
              .filter(p => p.categoria === categoriaActiva)
              .map(p => (
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
                      <span className="item-name" style={{ color: productoAbierto === p.id ? 'var(--blanco)' : 'var(--turquesa-logo)' }}>
                        {p.nombre}
                      </span>
                      <span className="item-price" style={{ color: productoAbierto === p.id ? 'var(--blanco)' : 'var(--turquesa-logo)' }}>
                        ${p.precio}
                      </span>
                    </div>

                    {productoAbierto === p.id && (
                      <div className="item-detail">
                        <div className="description-col">
                          <p className="item-description">{p.descripcion || "Elaboración artesanal."}</p>
                        </div>
                        <div className="image-col">
                          {p.imagen && (
                            <img 
                              src={p.imagen} 
                              alt={p.nombre} 
                              className="item-image" 
                              onClick={() => setImagenAmpliada(p.imagen)} 
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Parador Inkier - Colón, Entre Ríos 🌴</p>
      </footer>
    </div>
  );
}

export default App;