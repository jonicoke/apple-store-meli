import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { BsArrowLeft, BsCartPlus, BsCheckCircle, BsXCircle } from "react-icons/bs";
import "../styles/components/detalleProducto.css";
import  useProductDetail  from "../hooks/useProductDetail"
function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito} = useCart();
  const { product, loading, error} = useProductDetail(id);

  const [estadoBoton, setEstadoBoton] = useState("normal");
  const [imagenActiva, setImagenActiva] = useState(0);
  const [descExpandida, setDescExpandida] = useState(false);
  
  if (loading) return <p className="detalle-notfound">Cargando producto...</p>;
  if (error || !product) {
    return(
      <div className="detalle-notfound">
        <p>{error || "Producto no encontrado."}</p>
        <button onClick={() => navigate("/productos")}>Volver al catálogo</button>
      </div>
    )
  }

  const tienePrecio = product.precio |= null;
  const descuento = product.precioOriginal && tienePrecio ? Math.round((1- product.precio / product.precioOriginal) * 100) : null;

  const handleAgregar = () => {
    if (estadoBoton !== "normal" || !tienePrecio) return;
    setEstadoBoton("cargando");
    setTimeout(() => {
      // El carrito espera "imagen" (una sola), así que adaptamos el objeto
      agregarAlCarrito({ ...product, imagen: product.imagenes[0] });
      setEstadoBoton("exito");
      setTimeout(() => setEstadoBoton("normal"), 2000);
    }, 1000);
  };

  return (
    <main className="detalle-page">

      <button className="detalle-volver" onClick={() => navigate(-1)}>
        <BsArrowLeft /> Volver
      </button>

      <div className="detalle-contenedor">

        {/* IMAGENES */}
        <div className="detalle-imagen-wrap">
          <img src={product.imagenes[imagenActiva]} alt={product.nombre} className="detalle-imagen"/>
                    {product.imagenes.length > 1 && (
            <div className="detalle-miniaturas">
              {product.imagenes.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`${product.nombre} ${i + 1}`}
                  className={`detalle-miniatura ${i === imagenActiva ? "activa" : ""}`}
                  onClick={() => setImagenActiva(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="detalle-info">
          <p className="detalle-categoria">{product.categoria}</p>
          <h1 className="detalle-nombre">{product.nombre}</h1>

         <div className="detalle-precios">

            {tienePrecio ? (
              <>
              {product.precioOriginal && (
              <div className="detalle-precio-anterior-wrap">
                <span className="detalle-precio-anterior">
                  $ {product.precioOriginal.toLocaleString("es-AR")}
                </span>
                <span className="detalle-descuento"> {descuento}% OFF </span>
              </div>
                )}

              <p className="detalle-precio">
                $ {product.precio.toLocaleString("es-AR")}
              </p>
              <p className="detalle-cuotas">
                12 cuotas sin interés de ${" "}
                {Math.round(product.precio / 12).toLocaleString("es-AR")}
              </p>
                </>
            ) : (
              <p className="detalle-precio">Consultar precio</p>
            )}
          </div>

          {product.descripcion && (
            <div>
              <p className={`detalle-descripcion ${descExpandida ? "" : "recortada"}`}>
                {product.descripcion}
              </p>
              <button
                className="detalle-ver-mas"
                onClick={() => setDescExpandida(prev => !prev)}
              >
                {descExpandida ? "Ver menos" : "Ver descripción completa"}
              </button>
            </div>
          )}

          <button
            className={`detalle-boton ${estadoBoton === "cargando" ? "cargando" : "" } ${ estadoBoton === "exito" ? "exito" : ""}`}
            disabled={!tienePrecio || estadoBoton !== "normal"}
            onClick={handleAgregar}>
            {estadoBoton === "normal" && (<><BsCartPlus /> Agregar al carrito</>)}
            {estadoBoton === "cargando" && (<><span className="spinner-carrito"></span>Añadiendo...</>)}
            {estadoBoton === "exito" && (<>✓ ¡Añadido!</>)}
          </button>
          <a className="detalle-ml" href={product.enlaceCompra} target="_blank" rel="noopener noreferrer">
            Ver en Mercado Libre
          </a>
          {/* ESPECIFICACIONES */}
          {product.specs.length > 0 && (
            <div className="detalle-specs">
              <h2 className="detalle-specs-titulo">Especificaciones</h2>
              <table className="detalle-specs-tabla">
                <tbody>
                  {product.specs.map((s) => (
                    <tr key={s.label}>
                      <td className="spec-label">{s.label}</td>
                      <td className="spec-valor">{s.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default DetalleProducto;