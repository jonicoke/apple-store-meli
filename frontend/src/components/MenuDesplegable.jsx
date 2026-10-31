import { useState } from "react";
import { Link } from "react-router-dom";
import useProductosMenu from "../hooks/useProductosMenu";

const CONFIG = {
  iPhone: {
    titulo: "Móviles",
    lineas: [
      { label: "iPhone 17", query: "iPhone 17" },
      { label: "iPhone 17 Pro", query: "iPhone 17 Pro" },
      { label: "iPhone 16", query: "iPhone 16" },
    ],
  },
  Audio: {
    titulo: "Audio",
    lineas: [
      { label: "AirPods Pro", query: "AirPods Pro" },
      { label: "AirPods Max", query: "AirPods Max" },
      { label: "AirPods 4", query: "AirPods 4" },
    ],
  },
  Computación: {
    titulo: "Computación",
    lineas: [
      { label: "MacBook Air", query: "MacBook Air" },
      { label: "MacBook Pro", query: "MacBook Pro" },
      { label: "Mac Mini", query: "Mac Mini" },
      { label: "iMac", query: "iMac" },
    ],
  },
  Accesorios: {
    titulo: "Accesorios",
    lineas: [
      { label: "Apple Watch", query: "Apple Watch" },
      { label: "MagSafe", query: "MagSafe" },
      { label: "Apple Pencil", query: "Apple Pencil" },
    ],
  },
};

function MenuDesplegable({ categoria }) {
  const config = CONFIG[categoria];
  const [lineaActiva, setLineaActiva] = useState(0);

  // El hook se llama siempre (antes de cualquier return condicional)
  const query = config?.lineas[lineaActiva]?.query;
  const { productos, loading } = useProductosMenu(query);

  if (!config) return null;

  return (
    <div className="menu-desplegable">
      <div className="menu-desplegable-content">

        {/* SIDEBAR */}
        <div className="menu-desplegable-sidebar">
          <h3>{config.titulo}</h3>
          {config.lineas.map((linea, i) => (
            <div
              key={linea.label}
              className={`menu-sidebar-item ${i === lineaActiva ? "activo" : ""}`}
              onMouseEnter={() => setLineaActiva(i)}
            >
              <span>{linea.label}</span>
              <span className="menu-sidebar-arrow">›</span>
            </div>
          ))}
          <Link
            to={`/productos?cat=${categoria.toLowerCase()}`}
            className="menu-ver-todos"
          >
            Ver todos →
          </Link>
        </div>

        {/* CARDS */}
        <div className="menu-desplegable-products">
          {loading ? (
            <p className="menu-proximamente">Cargando...</p>
          ) : productos.length > 0 ? (
            productos.map((p) => (
              <Link
                to={`/producto/${p.id}`}
                key={p.id}
                className="menu-desplegable-card"
              >
                <img src={p.imagen} alt={p.nombre} />
                <span className="menu-card-nombre">{p.nombre}</span>
                <span className="menu-card-precio">
                  {p.precio.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </Link>
            ))
          ) : (
            <p className="menu-proximamente">Próximamente</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default MenuDesplegable;