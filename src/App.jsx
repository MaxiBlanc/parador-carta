import React, { useState, useEffect } from 'react';
import { db } from './Firebase/config'; // Asegurate que sea minúscula si ya lo corregiste
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Inyectamos Reset de CSS y Fuente Montserrat
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body, html {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #A2DED0;
  }
`;
document.head.appendChild(styleTag);

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
    width: '100vw',
    fontFamily: "'Montserrat', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // CENTRADO HORIZONTAL GLOBAL
  },
  header: {
    backgroundColor: colors.turquesaLogo,
    padding: '40px 20px',
    textAlign: 'center',
    color: colors.blanco,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    padding: '20px 15px',
    width: '100%',
    maxWidth: '500px', // Limita el ancho en pantallas grandes pero permite centrar en móviles
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  section: { 
    marginBottom: '35px',
    width: '100%' 
  },
  categoryContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '15px'
  },
  categoryPill: {
    backgroundColor: colors.turquesaLogo,
    color: colors.blanco,
    padding: '8px 25px',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  menuList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  itemContainer: {
    marginBottom: '12px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '20px',
    width: '100%', // Ocupa el ancho del main
    maxWidth: '400px', // Para que no se estire de más en tablets
    transition: '0.3s'
  },
  productBar: {
    padding: '12px 20px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    width: '100%'
  },
  itemName: { 
    fontSize: '0.85rem', 
    fontWeight: '700', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  itemPrice: { 
    fontSize: '0.95rem', 
    fontWeight: '700' 
  },
  itemDetail: {
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'left'
  },
  descriptionCol: { flex: 1.5 },
  imageCol: { flex: 1, display: 'flex', justifyContent: 'center' },
  itemImage: {
    width: '85px',
    height: '85px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: `2px solid ${colors.turquesaLogo}`,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    boxSizing: 'border-box'
  },
  itemDescription: {
    fontSize: '0.75rem',
    color: colors.verdeOscuroTexto,
    margin: 0,
    lineHeight: '1.4',
    fontWeight: '500',
    fontStyle: 'italic'
  },
  footer: { 
    textAlign: 'center', 
    padding: '30px 20px', 
    color: colors.verdeOscuroTexto, 
    fontSize: '0.7rem', 
    fontWeight: '600',
    opacity: 0.8,
    width: '100%'
  }
};

export default App;