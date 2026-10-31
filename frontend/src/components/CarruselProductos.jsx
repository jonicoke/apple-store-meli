import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useProductosOfertas from "../hooks/useProductsOfertas";
import "../styles/pages/inicio.css";

function CarruselProductos() {
  const { ofertas, loading, error } = useProductosOfertas();

  const [actual, setActual] = useState(0);
  const [animando, setAnimando] = useState(false);

  const total = ofertas.length;

  const cambiar = (dir) => {
    if (animando || total <= 1) return;

    setAnimando(true);

    setTimeout(() => {
      setActual((prev) => (prev + dir + total) % total);
      setAnimando(false);
    }, 300);
  };

  useEffect(() => {
    if (total <= 1) return;

    const timer = setInterval(() => {
      cambiar(1);
    }, 4000);

    return () => clearInterval(timer);
  }, [actual, total, animando]);

  useEffect(() => {
    setActual(0);
  }, [total]);

  if (loading) return <p>Cargando ofertas...</p>;
  if (error) return <p>No se pudieron cargar las ofertas.</p>;
  if (total === 0) return null;

  const p = ofertas[actual];

  // La API de Mercado Libre usa otros nombres de campos.
  const nombre = p.title;
  const imagen = p.thumbnail;
  const precio = p.buy_box_winner?.price;

  return (
    <section className="carrusel-section">
      <div className="carrusel-header">
        <p className="carrusel-eyebrow">catálogo destacado</p>
        <h2 className="carrusel-titulo">
          Nuestras mejores <em>ofertas.</em>
        </h2>
      </div>

      <div className="carrusel-wrapper">
        <button
          className="carrusel-arrow"
          onClick={() => cambiar(-1)}
          aria-label="Anterior"
        >
          &#8592;
        </button>

        <div
          className={`carrusel-card ${
            animando ? "fade-out" : "fade-in"
          }`}
        >
          <div className="carrusel-img-wrap">
            <span className="carrusel-tag">Destacado</span>
            <img src={imagen} alt={nombre} loading="lazy" />
          </div>

          <div className="carrusel-info">
            <h3 className="carrusel-nombre">{nombre}</h3>

            {precio != null && (
              <p className="carrusel-precio">
                {precio.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                })}
              </p>
            )}

            <div className="carrusel-btns">
              <a
                href={p.permalink}
                target="_blank"
                rel="noreferrer"
                className="carrusel-btn-detalle"
              >
                Ver en Mercado Libre
              </a>

              <Link
                to="/productos"
                className="carrusel-btn-catalogo"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>

        <button
          className="carrusel-arrow"
          onClick={() => cambiar(1)}
          aria-label="Siguiente"
        >
          &#8594;
        </button>
      </div>

      <div className="carrusel-dots">
        {ofertas.map((producto, i) => (
          <button
            key={producto.id ?? i}
            className={`dot ${
              i === actual ? "dot-activo" : ""
            }`}
            onClick={() => setActual(i)}
            aria-label={`Producto ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default CarruselProductos;
