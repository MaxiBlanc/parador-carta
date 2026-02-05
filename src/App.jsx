import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Agregamos el link de Google Fonts directamente en el JS (o podés ponerlo en tu index.html)
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoAbierto, setProductoAbierto] = useState(null);

  useEffect(() => {
    const qCat = query(collection(db, "categorias"), orderBy("nombre", "asc"));
    onSnapshot(qCat, (snap) => setCategorias(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
    onSnapshot(collection(db, "productos"), (snap) => setProductos(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
  }, []);

  const toggleProducto = (id) => {
    setProductoAbierto(productoAbierto === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logoText}>INKIER</h1>
        <p style={styles.subText}>PARADOR</p>
      </header>

      <main style={styles.main}>
        {categorias.map(cat => (
          <section key={cat.id} style={styles.section}>
            
            <div style={styles.categoryContainer}>
                <div style={styles.categoryPill}>
                   {cat.nombre}
                </div>
            </div>
            
            <div style={styles.menuList}>
              {productos.filter(p => p.categoria === cat.nombre).map(p => (
                <div key={p.id} style={styles.itemContainer}>
                  
                  <div style={{
                    ...styles.productCard,
                    backgroundColor: productoAbierto === p.id ? 'rgba(255,255,255,0.8)' : 'transparent'
                  }}>
                    <div 
                      style={{
                        ...styles.productBar, 
                        backgroundColor: productoAbierto === p.id ? colors.turquesaLogo : colors.blanco 
                      }} 
                      onClick={() => toggleProducto(p.id)}
                    >
                      {/* Agregamos textTransform uppercase para que sea igual a la foto */}
                      <span style={{
                        ...styles.itemName,
                        color: productoAbierto === p.id ? colors.blanco : colors.turquesaLogo
                      }}>{p.nombre}</span>
                      
                      <span style={{
                        ...styles.itemPrice,
                        color: productoAbierto === p.id ? colors.blanco : colors.turquesaLogo
                      }}>${p.precio}</span>
                    </div>

                    {productoAbierto === p.id && (
                      <div style={styles.itemDetail}>
                        <div style={styles.descriptionCol}>
                          <p style={styles.itemDescription}>{p.descripcion || "Elaboración artesanal."}</p>
                        </div>
                        <div style={styles.imageCol}>
                          {p.imagen && <img src={p.imagen} alt={p.nombre} style={styles.itemImage} />}
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

      <footer style={styles.footer}>
        <p>Parador Inkier - Colón, Entre Ríos 🌴</p>
      </footer>
    </div>
  );
}

const colors = {
  turquesaLogo: '#4DB9A8',
  verdeFondo: '#A2DED0',
  blanco: '#FFFFFF',
  verdeOscuroTexto: '#2C5F55',
};

const styles = {
  container: {
    backgroundColor: colors.verdeFondo,
    minHeight: '100vh',
    fontFamily: "'Montserrat', sans-serif", // Cambiamos la fuente a Montserrat
  },
  header: {
    backgroundColor: colors.turquesaLogo,
    padding: '40px 20px',
    textAlign: 'center',
    color: colors.blanco,
    marginBottom: '20px'
  },
  logoText: { 
    margin: 0, 
    fontSize: '2.8rem', 
    letterSpacing: '6px', 
    fontWeight: '300' 
  },
  subText: { 
    margin: 0, 
    fontSize: '1rem', 
    letterSpacing: '8px', 
    fontWeight: '700',
    marginTop: '5px'
  },
  main: {
    padding: '10px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  section: { marginBottom: '40px' },
  categoryContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '20px'
  },
  categoryPill: {
    backgroundColor: colors.turquesaLogo,
    color: colors.blanco,
    padding: '10px 30px',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  itemContainer: {
    marginBottom: '10px',
    textAlign: 'center' // Centramos los productos también para que las barras se vean prolijas
  },
  productCard: {
    display: 'inline-flex',
    flexDirection: 'column',
    borderRadius: '20px',
    width: '100%',
    transition: '0.3s'
  },
  productBar: {
    padding: '12px 25px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  itemName: { 
    fontSize: '0.9rem', 
    fontWeight: '700', 
    textTransform: 'uppercase', // Igual a la imagen
    letterSpacing: '1px'
  },
  itemPrice: { 
    fontSize: '1rem', 
    fontWeight: '700' 
  },
  itemDetail: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    textAlign: 'left'
  },
  descriptionCol: { flex: 1.5 },
  imageCol: { flex: 1, display: 'flex', justifyContent: 'center' },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '15px',
    // EL MARQUITO:
    border: `3px solid ${colors.turquesaLogo}`, // Agrega el borde con el color del logo
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    boxSizing: 'border-box' // Asegura que el borde no agrande la imagen
  },
  itemDescription: {
    fontSize: '0.8rem',
    color: colors.grisOscuroTexto,
    margin: 0,
    lineHeight: '1.5',
    fontWeight: '500',
    fontStyle: 'italic'
  },
  footer: { 
    textAlign: 'center', 
    padding: '40px', 
    color: colors.blanco, 
    fontSize: '0.75rem', 
    fontWeight: '600',
    letterSpacing: '1px'
  }
};

export default App;