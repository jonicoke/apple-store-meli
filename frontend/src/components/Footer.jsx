function Footer() {
  return (
    <footer className="footer">

      {/* ── FRANJA DE CONTACTO ── */}
      <div className="footer-contact-strip">

        <div className="contact-block">
          <div className="contact-brand">
            {/* Reemplazá BsApple por tu ícono */}
            <span className="brand-icon">&#63743;</span> Apple Store
          </div>
          <p>Tu tienda especializada en productos Apple. Envíos a todo el país.</p>
          <div className="social-links">
            <a href="/" aria-label="Instagram">IG</a>
            <a href="/" aria-label="Facebook">FB</a>
            <a href="/" aria-label="Twitter">TW</a>
            <a href="/" aria-label="LinkedIn">LI</a>
          </div>
        </div>

        <div className="contact-item">
          <h5>Atención al cliente</h5>
          <p className="phone">0800-APPLE-01</p>
          <p className="hours">LU–VI de 09:00 a 18:00<br />SA de 09:00 a 13:00</p>
        </div>

        <div className="contact-item">
          <h5>Soporte técnico</h5>
          <p className="phone">0810-999-3728</p>
          <p className="hours">LU–VIE de 08:00 a 20:00<br />SA de 09:00 a 13:00</p>
        </div>

        <div className="contact-item">
          <h5>Asistente virtual</h5>
          <a className="wa-btn" href="/">
            WhatsApp · Chateá con nosotros
          </a>
          <p className="hours" style={{ marginTop: "8px" }}>
            También por email:<br />soporte@applestore.com
          </p>
        </div>

      </div>

      {/* ── COLUMNAS PRINCIPALES ── */}
      <div className="footer-main">

        <div className="footer-newsletter">
          <label>Recibí ofertas y promociones</label>
          <p className="newsletter-subtitle">
            Enterate primero de los lanzamientos, descuentos exclusivos y novedades Apple.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Ingresá tu email" />
            <button type="button">Suscribirme</button>
          </div>
        </div>

        <div className="footer-col">
          <h4>Productos</h4>
          <ul>
            <li><a href="/productos?cat=iphone">iPhone</a></li>
            <li><a href="/productos?cat=audio">Audio</a></li>
            <li><a href="/productos?cat=computación">Computacion</a></li>
            <li><a href="/productos?cat=accesorios">Accesorios</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Comprar</h4>
          <ul>
            <li><a href="/productos?cat=ofertas">Ofertas</a></li>
            <li><a href="/">Medios de pago</a></li>
            <li><a href="/">Envíos</a></li>
            <li><a href="/">Garantía</a></li>
            <li><a href="/">Promociones bancarias</a></li>
            <li><a href="/">Botón de arrepentimiento</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Ayuda</h4>
          <ul>
            <li><a href="/">Centro de ayuda</a></li>
            <li><a href="/">Seguimiento de pedido</a></li>
            <li><a href="/">Servicio técnico</a></li>
            <li><a href="/">Preguntas frecuentes</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Compañía</h4>
          <ul>
            <li><a href="/nosotros">Acerca de nosotros</a></li>
            <li><a href="/">Sucursales</a></li>
            <li><a href="/">Trabajá con nosotros</a></li>
            <li><a href="/">Información legal</a></li>
            <li>
              <a
                href="https://github.com/Brandonduce67/tienda-iphones-react"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── FOOTER BOTTOM ── */}
      <div className="footer-divider" />

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Apple Store — Proyecto académico UNAHUR CIU. Todos los derechos reservados.</p>
        <div className="footer-legal-links">
          <a href="/">Términos y condiciones</a>
          <a href="/">Privacidad</a>
          <a href="/">Legales</a>
        </div>
      </div>

    </footer>
  );
}

export default Footer;