import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BsTrash, BsArrowRight, BsBag, BsShieldCheck, BsTruck } from "react-icons/bs";
import "../styles/pages/carrito.css";
import { productos } from "../data/productos";


function Carrito() {
  const {
    carrito,
    stocks,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    vaciarCarrito,
    confirmarCompra,
    cantidadTotal,
    total,
  } = useCart();

  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const envio       = total > 2000 ? 0 : 50;
  const seguro      = total * 0.02;
  const importacion = total * 0.08;
  const totalFinal  = total + envio + seguro + importacion;

  const confirmarIrAContacto = () => {
    setMostrarModal(false);
    navigate("/contacto");
  };

  if (carrito.length === 0) {
    return (
      <main className="carrito-page">
        <div className="carrito-vacio">
          <div className="carrito-vacio-icon"><BsBag /></div>
          <h2>Tu carrito está vacío</h2>
          <p>Explorá nuestro catálogo y encontrá tu próximo Apple favorito.</p>
          <Link to="/productos" className="carrito-btn-primario">
            Ver productos <BsArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="carrito-page">

      <div className="carrito-hero">
        <p className="eyebrow">Tu selección</p>
        <h1 className="carrito-titulo">Mi <em>carrito</em></h1>
        <p className="carrito-sub">{cantidadTotal} {cantidadTotal === 1 ? "artículo" : "artículos"} seleccionados</p>
      </div>

      <div className="carrito-layout">

        <div className="carrito-lista">
          {carrito.map(producto => (
            <div key={producto.id} className="carrito-item">

              <div className="carrito-item-img">
                <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
              </div>

              <div className="carrito-item-info">
                <p className="carrito-item-cat">{producto.categoria}</p>
                <h3 className="carrito-item-nombre">{producto.nombre}</h3>
                <p className="carrito-item-variante">
                  {[producto.color, producto.almacenamiento].filter(Boolean).join(" · ")}
                </p>

                <div className="carrito-item-bottom">
                  <div className="cantidad-control">
                    <button onClick={() => disminuirCantidad(producto.id)} aria-label="Disminuir">−</button>
                    <span>{producto.cantidad}</span>
                    <button
                      onClick={() => aumentarCantidad(producto.id)}
                      aria-label="Aumentar"
                      disabled={stocks[producto.id] <= 0}
                    >+</button>
                  </div>

                  <div className="carrito-item-precios">
                    {producto.tag === "Oferta" && (
                      <span className="carrito-item-precio-original">
                        USD ${(Math.round(producto.precio * 1.2) * producto.cantidad).toLocaleString("es-AR")}
                      </span>
                    )}
                    <span className="carrito-item-subtotal">
                      USD ${(producto.precio * producto.cantidad).toLocaleString("es-AR")}
                    </span>
                    {producto.cantidad > 1 && (
                      <span className="carrito-item-unitario">
                        USD ${producto.precio.toLocaleString("es-AR")} c/u
                      </span>
                    )}
                  </div>

                  <button
                    className="carrito-item-eliminar"
                    onClick={() => eliminarProducto(producto.id)}
                    aria-label="Eliminar producto"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>

            </div>
          ))}

          <button className="carrito-vaciar" onClick={vaciarCarrito}>
            Vaciar carrito
          </button>
        </div>

        <aside className="carrito-resumen">
          <div className="resumen-card">
            <h3 className="resumen-titulo">Resumen del pedido</h3>

            <div className="resumen-lineas">
              <div className="resumen-linea">
                <span>Subtotal ({cantidadTotal} {cantidadTotal === 1 ? "artículo" : "artículos"})</span>
                <span>USD ${total.toLocaleString("es-AR")}</span>
              </div>
              <div className="resumen-linea">
                <span>Envío</span>
                <span className={envio === 0 ? "resumen-gratis" : ""}>
                  {envio === 0 ? "Gratis" : `USD $${envio.toFixed(2)}`}
                </span>
              </div>
              <div className="resumen-linea">
                <span>Seguro (2%)</span>
                <span>USD ${seguro.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="resumen-linea">
                <span>Gestión de importación (8%)</span>
                <span>USD ${importacion.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="resumen-total">
              <span>Total</span>
              <span>USD ${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
            </div>

            {envio === 0 && (
              <p className="resumen-envio-gratis">
                <BsTruck /> Envío gratis por superar USD 2.000
              </p>
            )}

            <button
              className="carrito-btn-primario carrito-btn-full"
              onClick={() => setMostrarModal(true)}
            >
              Continuar con la compra <BsArrowRight />
            </button>

            <div className="resumen-garantias">
              <span><BsShieldCheck /> Compra 100% segura</span>
              <span><BsTruck /> Envíos a todo el país</span>
            </div>
          </div>
        </aside>
      </div>

      {mostrarModal && (
        <div className="carrito-modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="carrito-modal" onClick={e => e.stopPropagation()}>

            <h3>¿Listo para finalizar?</h3>
            <p>
              Tu pedido por <strong>USD ${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</strong> está
              listo. En el siguiente paso completás los datos de envío y contacto.
            </p>

            <div className="modal-lineas">
              <div className="modal-linea">
                <span>{cantidadTotal} {cantidadTotal === 1 ? "artículo" : "artículos"}</span>
                <span>USD ${total.toLocaleString("es-AR")}</span>
              </div>
              <div className="modal-linea modal-linea--total">
                <span>Total con cargos</span>
                <span>USD ${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="modal-botones">
              <button className="modal-btn-secundario" onClick={() => setMostrarModal(false)}>
                Volver al carrito
              </button>
              <button className="modal-btn-primario" onClick={confirmarIrAContacto}>
                Completar datos <BsArrowRight />
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}

export default Carrito;