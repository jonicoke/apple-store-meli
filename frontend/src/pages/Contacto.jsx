import { useState} from "react";
import {
  BsPerson, BsEnvelope, BsTelephone, BsGeoAlt,
  BsTruck, BsChat, BsArrowRight
} from "react-icons/bs";
import { Link } from "react-router-dom";
import "../styles/pages/contacto.css";
import { useCart } from "../context/CartContext";
import { productos } from "../data/productos";

const Contacto = () => {
  
  const { carrito, confirmarCompra } = useCart();
  const esModoCompra = carrito && carrito.length > 0;

  const [formData, setFormData] = useState({
    nombre:    "",
    email:     "",
    telefono:  "",
    direccion: "",
    entrega:   "correo",
    mensaje:   "",
  });

  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [eraCompra, setEraCompra] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errores[name]) setErrores({ ...errores, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    const regexLetras  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexNumeros = /^[0-9\s+-]+$/;

    if (!formData.nombre.trim())
      nuevosErrores.nombre = "El nombre y apellido son obligatorios.";
    else if (!regexLetras.test(formData.nombre))
      nuevosErrores.nombre = "El nombre solo puede contener letras.";

    if (!formData.email.trim())
      nuevosErrores.email = "El email es obligatorio.";
    else if (!formData.email.includes("@") || !formData.email.includes("."))
      nuevosErrores.email = "El formato del email no es válido.";

    if (!formData.telefono.trim())
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    else if (!regexNumeros.test(formData.telefono))
      nuevosErrores.telefono = "Solo se permiten números.";

    if (!formData.direccion.trim())
      nuevosErrores.direccion = "La dirección o localidad es obligatoria.";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    
    if (esModoCompra) {
  setEraCompra(true);
  confirmarCompra();
}

setEnviado(true);
    
  };

  /* ── PANTALLA DE ÉXITO ── */
  if (enviado) {
  return (
    <main className="contacto-page">
      <div className="contacto-success">
        <div className="success-icon">✓</div>

        <h2>{eraCompra ? "¡Pedido recibido!" : "¡Mensaje enviado!"}</h2>

        <p>
          {eraCompra
            ? `Nos contactaremos con ${formData.nombre} a la brevedad para confirmar tu compra.`
            : `Recibimos tu consulta. Te respondemos a la brevedad en ${formData.email}.`}
        </p>

        {eraCompra && (
          <p className="success-email">{formData.email}</p>
        )}

        <Link to="/" className="success-btn">
          {eraCompra ? "Seguir comprando" : "Volver al inicio"}
        </Link>

      </div>
    </main>
  );
}

  return (
    <main className="contacto-page">

      
      <div className="contacto-hero">
        <p className="eyebrow">{esModoCompra ? "Finalizá tu compra" : "Contacto"}</p>
        <h1 className="contacto-titulo">
          {esModoCompra
            ? <><span>Un paso más</span><br /><em>y es tuyo.</em></>
            : <><span>¿Tenés alguna</span><br /><em>consulta?</em></>}
        </h1>
        <p className="contacto-sub">
          {esModoCompra
            ? "Completá tus datos para que podamos procesar tu pedido y coordinar la entrega."
            : "Completá el formulario y te respondemos a la brevedad. También podés escribirnos por WhatsApp."}
        </p>
      </div>

      <div className="contacto-layout">

        {/* ── FORMULARIO ── */}
        <form className="contacto-form" onSubmit={handleSubmit} noValidate>

          <div className="form-grid">

            {/* Nombre */}
            <div className={`form-field ${errores.nombre ? "form-field--error" : ""}`}>
              <label htmlFor="nombre">Nombre y apellido</label>
              <div className="input-wrap">
                <BsPerson className="input-icon" />
                <input
                  id="nombre" type="text" name="nombre"
                  placeholder="Pepito Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>

            {/* Email */}
            <div className={`form-field ${errores.email ? "form-field--error" : ""}`}>
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <BsEnvelope className="input-icon" />
                <input
                  id="email" type="email" name="email"
                  placeholder="pepito@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errores.email && <p className="form-error">{errores.email}</p>}
            </div>

            {/* Teléfono */}
            <div className={`form-field ${errores.telefono ? "form-field--error" : ""}`}>
              <label htmlFor="telefono">Teléfono</label>
              <div className="input-wrap">
                <BsTelephone className="input-icon" />
                <input
                  id="telefono" type="tel" name="telefono"
                  placeholder="11 1234-5678"
                  value={formData.telefono}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
              {errores.telefono && <p className="form-error">{errores.telefono}</p>}
            </div>

            {/* Dirección */}
            <div className={`form-field ${errores.direccion ? "form-field--error" : ""}`}>
              <label htmlFor="direccion">Dirección o localidad</label>
              <div className="input-wrap">
                <BsGeoAlt className="input-icon" />
                <input
                  id="direccion" type="text" name="direccion"
                  placeholder="Av. Corrientes 1234, CABA"
                  value={formData.direccion}
                  onChange={handleChange}
                  autoComplete="street-address"
                />
              </div>
              {errores.direccion && <p className="form-error">{errores.direccion}</p>}
            </div>

          </div>

          {/* Método de entrega */}
          <div className="form-field form-field--full">
            <label>
              <BsTruck style={{ marginRight: 6 }} />
              Método de entrega
            </label>
            <div className="entrega-opciones">
              {[
                { value: "correo",   label: "Correo Argentino",   desc: "3 a 7 días hábiles" },
                { value: "sucursal", label: "Retiro en sucursal",  desc: "Disponible en 24 hs" },
              ].map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`entrega-opcion ${formData.entrega === value ? "entrega-opcion--activa" : ""}`}
                >
                  <input
                    type="radio" name="entrega" value={value}
                    checked={formData.entrega === value}
                    onChange={handleChange}
                  />
                  <BsTruck className="entrega-icon" />
                  <div>
                    <span className="entrega-label">{label}</span>
                    <span className="entrega-desc">{desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Mensaje */}
          <div className="form-field form-field--full">
            <label htmlFor="mensaje">
              <BsChat style={{ marginRight: 6 }} />
              {esModoCompra ? "Mensaje o aclaración" : "Mensaje o consulta"}
              <span className="label-opcional">{esModoCompra ? " (opcional)" : ""}</span>
            </label>
            <textarea
              id="mensaje" name="mensaje" rows={3}
              placeholder={
                esModoCompra
                  ? "Ej: Tocar timbre 2B, dejar en recepción..."
                  : "Escribinos tu consulta y te respondemos a la brevedad."
              }
              value={formData.mensaje}
              onChange={handleChange}
            />
          </div>

          {/* Resumen carrito / aviso */}
          {esModoCompra ? (
            <div className="contacto-resumen">
              <span className="resumen-label">Productos en el carrito </span>
              <span className="resumen-count">
                {carrito.length} {carrito.length === 1 ?  "artículo" : "artículos"}
              </span>
            </div>
          ) : (
            <p className="contacto-aviso">
              Si querés finalizar una compra, primero agregá productos al carrito.
            </p>
          )}

          <button type="submit" className="contacto-submit">
            {esModoCompra ? "Finalizar compra" : "Enviar consulta"}
            <BsArrowRight />
          </button>

        </form>

        {/* ── ASIDE ── */}
        <aside className="contacto-aside">

          <div className="aside-card">
            <h3>¿Por qué elegirnos?</h3>
            <ul className="aside-list">
              <li><span className="aside-check">✓</span> Productos 100% originales</li>
              <li><span className="aside-check">✓</span> Garantía oficial Apple</li>
              <li><span className="aside-check">✓</span> Hasta 12 cuotas sin interés</li>   
              <li><span className="aside-check">✓</span> Envíos a todo el país</li>
              <li><span className="aside-check">✓</span> Atención personalizada</li>
            </ul>
          </div>

          <div className="aside-card aside-card--contacto">
            <h3>¿Preferís hablar?</h3>
            <p>Escribinos por WhatsApp o por mail y te respondemos en minutos.</p>
            <a href="https://wa.me/5491128555086" className="aside-wa-btn" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href="mailto:soporte@applestore.com" className="aside-mail">
              soporte@applestore.com
            </a>
          </div>

        </aside>

      </div>
    </main>
  );
};

export default Contacto;