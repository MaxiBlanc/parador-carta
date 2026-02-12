import React, { useState, useEffect } from 'react';
import { db } from './Firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import './App.css';
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { IoMdStarHalf } from "react-icons/io";

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoAbierto, setProductoAbierto] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null); // Ahora guardará el objeto del producto
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  useEffect(() => {
    const unsubscribeCat = onSnapshot(collection(db, "categorias"), (snap) => {
      const listaCat = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      listaCat.sort((a, b) => (a.nro || 0) - (b.nro || 0));
      setCategorias(listaCat);
      
      if (listaCat.length > 0 && !categoriaActiva) {
        setCategoriaActiva(listaCat[0].nombre);
      }
    });

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

  const seleccionarCategoria = (nombre) => {
    setCategoriaActiva(nombre);
    setProductoAbierto(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const toggleProducto = (id) => {
    setProductoAbierto(productoAbierto === id ? null : id);
  };

  return (
    <div className="app-container">
      {/* MODAL CON ETIQUETAS ENCIMADAS */}
      {imagenAmpliada && (
        <div className="modal-overlay" onClick={() => setImagenAmpliada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-label-name">{imagenAmpliada.nombre}</div>
            <img src={imagenAmpliada.imagen} className="image-full" alt="Zoom" />
            <div className="modal-label-price">${imagenAmpliada.precio}</div>
          </div>
          <button className="close-button" onClick={() => setImagenAmpliada(null)}>Cerrar</button>
        </div>
      )}

      <header className="header">
        <img src="/vite.jpeg" alt="Logo Parador Inkier" className="header-logo" />
      </header>

      <div className="nav-wrapper">
        <nav className="categories-nav">
          {categorias.map(cat => (
            <button 
              key={cat.id} 
              className={`category-item ${categoriaActiva === cat.nombre ? 'active' : ''}`}
              onClick={() => seleccionarCategoria(cat.nombre)}
            >
              {cat.nombre}
            </button>
          ))}
        </nav>
      </div>

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
                              onClick={() => setImagenAmpliada(p)} 
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
        {/* NUEVA SECCIÓN DE BOTONES DE CONTACTO */}
        <div className="contact-buttons">
          <a href="https://api.whatsapp.com/send/?phone=5493447573031&text&type=phone_number&app_absent=0&utm_source=ig" target="_blank" rel="noopener noreferrer" className="contact-circle" title="Contactanos aquí">
            <FaWhatsapp />
          </a>
          <a href="https://l.instagram.com/?u=https%3A%2F%2Fmaps.app.goo.gl%2FEnjDbNDyJgtEcGnUA%3Fg_st%3Dic%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnb84uuyEKf4_-WB12cFd1_QJYCXPHJqUitUTf_cAxt0YpBdD0jYnx69Nbzdk_aem_X6-SQuR7Tb0Psh6zZvB8Pw&e=AT0t_K3Pvfp0CbDh2iwjqdujn1o1lW8bD4b4mhMvV-zUVOaDxZ0ca5ugqeq9OKNcs15xV4LtTRbvOaS0baOsl6R5zruvGGoPbuP3gpRB2g" target="_blank" rel="noopener noreferrer" className="contact-circle" title="Encontranos aquí">
            <SiGooglemaps/>
          </a>
          <a href="https://www.google.com/maps/place/Parador+Inkier/@-32.2277914,-58.1286286,17z/data=!4m8!3m7!1s0x95ae3300511df805:0xd0862712f3db6f3!8m2!3d-32.2277914!4d-58.1286286!9m1!1b1!16s%2Fg%2F11xcm7n3_6?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="contact-circle" title="Calificanos aquí">
            <IoMdStarHalf />
          </a>
          <a href="https://www.instagram.com/paradorinkiercolon/" target="_blank" rel="noopener noreferrer" className="contact-circle" title="Enterate de todo aquí">
            <FaInstagram />
          </a>
        </div>

        <p>Parador Inkier - Colón, Entre Ríos 🌴</p>
      </footer>
    </div>
  );
}

export default App;