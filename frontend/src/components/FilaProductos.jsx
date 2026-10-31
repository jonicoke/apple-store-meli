import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useProductosCategoria from "../hooks/useProductosCategoria";

function FilaProductos({ titulo, subtitulo, categoria }) {
  const scrollRef = useRef(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const { productos, loading, error } =
    useProductosCategoria(categoria);

  const items = productos.filter(
    (p, i, lista) =>
      lista.findIndex((x) => x.id === p.id) === i
  );

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanLeft(el.scrollLeft > 8);
    setCanRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 8
    );
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkArrows();

    el.addEventListener("scroll", checkArrows, {
      passive: true,
    });
    window.addEventListener("resize", checkArrows);

    return () => {
      el.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, [items.length, loading]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: dir * 440,
      behavior: "smooth",
    });
  };

  return (
    <section className="fila-section">
      <div className="fila-header">
        <div>
          <h2 className="fila-titulo">{titulo}</h2>
          {subtitulo && (
            <p className="fila-subtitulo">{subtitulo}</p>
          )}
        </div>

        <div className="fila-header-right">
          <div className="fila-arrows">
            <button
              className="fila-arrow"
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              aria-label="Anterior"
            >
              ‹
            </button>

            <button
              className="fila-arrow"
              onClick={() => scroll(1)}
              disabled={!canRight}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          <Link
            to={`/productos?cat=${encodeURIComponent(categoria.toLowerCase())}`}
            className="fila-ver-todos"
          >
            Ver todos →
          </Link>
        </div>
      </div>

      {loading && <p>Cargando productos...</p>}

      {error && (
        <p>No se pudieron cargar los productos.</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p>No hay productos para mostrar.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="fila-scroll" ref={scrollRef}>
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                className="fila-card"
              >
                <div className="fila-img">
                  {p.imagen && (
                    <img src={p.imagen} alt={p.nombre} loading="lazy" />
                  )}
                </div>

                <div className="fila-info">
                  <p className="fila-categoria">{titulo}</p>
                  <p className="fila-nombre">{p.nombre}</p>

                  {p.precio != null && (
                    <p className="fila-precio">
                      {p.precio.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
        </div>
      )}
    </section>
  );
}

export default FilaProductos;