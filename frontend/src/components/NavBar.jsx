import { Link, NavLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { BsApple, BsBag, BsSearch, BsSun, BsMoon, BsList, BsX, BsChevronRight } from "react-icons/bs";
import MenuDesplegable from "./MenuDesplegable";

import { useCart } from "../context/CartContext";
import { useTema } from "../context/TemaContext";

const CATEGORIAS = [
  { key: "iphone",      to: "iphone",      label: "Móviles",     cat: "iPhone"     },
  { key: "audio",       to: "audio",       label: "Audio",       cat: "Audio"    },
  { key: "computación",  to: "computación", label: "Computación", cat: "Computación"        },
  { key: "accesorios",  to: "accesorios",  label: "Accesorios",  cat: "Accesorios" },
];

function NavBar() {
  const [busqueda, setBusqueda]     = useState("");
  const [hoverMenu, setHoverMenu]   = useState(null);
  const [menuOpen, setMenuOpen]     = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();

  const { cantidadTotal } = useCart();
  const { oscuro, setOscuro } = useTema();

  
  const [searchParams] = useSearchParams();
  const catActiva = searchParams.get("cat"); 

  const handleBusqueda = (e) => {
    if (e.key === "Enter" && busqueda.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(busqueda.trim())}`);
      setBusqueda("");
      setMenuOpen(false);
    }
  };

  const cerrarMenu = () => setMenuOpen(false);

  return (
    <header className="navbar-contenedor">

      {/* ── FILA SUPERIOR ── */}
      <div className="navbar-top">

        <Link to="/" className="navbar-logo" onClick={cerrarMenu}>
          <BsApple />
          <span className="logo-text">Apple Store</span>
        </Link>

        <div className="navbar-busqueda">
          <BsSearch className="busqueda-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={handleBusqueda}
          />
        </div>

        <div className="navbar-right">
          <NavLink to="/nosotros" end className={({ isActive }) => `navbar-link navbar-link--desktop ${isActive ? "active" : ""}`}>Nosotros</NavLink>
          <NavLink to="/contacto" end className={({ isActive }) => `navbar-link navbar-link--desktop ${isActive ? "active" : ""}`}>Contacto</NavLink>

          <button className="icon-btn" onClick={() => setOscuro(!oscuro)} aria-label="Cambiar tema">
            {oscuro ? <BsSun /> : <BsMoon />}
          </button>

          <Link to="/carrito" className="icon-btn cart-btn" aria-label="Carrito" onClick={cerrarMenu}>
            <BsBag />
            {cantidadTotal > 0 && <span className="cart-badge">{cantidadTotal}</span>}
          </Link>

          <button
            className="icon-btn navbar-hamburguesa"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menú"
          >
            {menuOpen ? <BsX style={{ fontSize: 22 }} /> : <BsList style={{ fontSize: 22 }} />}
          </button>
        </div>
      </div>

      {/* ── CATEGORÍAS DESKTOP ── */}
      <nav className="navbar-categorias">
        
        <Link
          to="/productos?cat=ofertas"
          className={`cat-link hot ${catActiva === "ofertas" ? "active" : ""}`}
        >
          Ofertas
        </Link>

        <div className="cat-sep" />

        {CATEGORIAS.map(({ key, to, label, cat }) => (
          <div
            key={key}
            className="cat-item"
            onMouseEnter={() => setHoverMenu(key)}
            onMouseLeave={() => setHoverMenu(null)}
          >
            <Link
              to={`/productos?cat=${to}`}
              className={`cat-link ${catActiva === to ? "active" : ""}`}
            >
              {label}
            </Link>
            {hoverMenu === key && <MenuDesplegable categoria={cat} />}
          </div>
        ))}

        <div className="cat-sep" />
      </nav>

      {/* ── MENÚ MOBILE ── */}
      {menuOpen && (
        <div className="navbar-mobile-menu">

          <p className="mobile-menu-section-label">Catálogo</p>

          <Link
            to="/productos?cat=ofertas"
            className={`mobile-menu-item mobile-menu-item--hot ${catActiva === "ofertas" ? "mobile-menu-item--active" : ""}`}
            onClick={cerrarMenu}
          >
            <span>🔥 Ofertas</span>
            <BsChevronRight className="mobile-menu-chevron" />
          </Link>

          {CATEGORIAS.map(({ key, to, label }) => (
            <Link
              key={key}
              to={`/productos?cat=${to}`}
              className={`mobile-menu-item ${catActiva === to ? "mobile-menu-item--active" : ""}`}
              onClick={cerrarMenu}
            >
              <span>{label}</span>
              <BsChevronRight className="mobile-menu-chevron" />
            </Link>
          ))}

          <div className="mobile-menu-divider" />

          <p className="mobile-menu-section-label">Más</p>

          <Link to="/nosotros" className="mobile-menu-item" onClick={cerrarMenu}>
            <span>Nosotros</span>
            <BsChevronRight className="mobile-menu-chevron" />
          </Link>

          <Link to="/contacto" className="mobile-menu-item" onClick={cerrarMenu}>
            <span>Contacto</span>
            <BsChevronRight className="mobile-menu-chevron" />
          </Link>

        </div>
      )}

    </header>
  );
}

export default NavBar;