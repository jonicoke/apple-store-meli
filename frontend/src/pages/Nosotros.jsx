import "../styles/pages/nosotros.css";
import { BsCreditCard, BsTruck, BsShieldCheck, BsShop, BsStarFill, BsAward } from "react-icons/bs";

function Nosotros() {
  return (
    <main className="nosotros">

      {/* Presentacion*/}
      <section className="nos-hero">
        <div className="nos-hero-inner">
          <p className="eyebrow">Quiénes somos</p>
          <h1 className="nos-titulo">
            Tu destino <em>Apple</em><br />en Argentina
          </h1>
          <p className="nos-sub">
            Desde 2018 llevamos la tecnología de Apple a miles de argentinos,
            con atención personalizada, precios accesibles y envíos a todo el país.
          </p>
        </div>
        <div className="nos-hero-deco" aria-hidden="true">
          <span className="deco-ring deco-ring-1" />
          <span className="deco-ring deco-ring-2" />
          <span className="deco-ring deco-ring-3" />
        </div>
      </section>

      {/*  MISION Y VISION */}
      <section className="nos-mv">
        <div className="nos-mv-card nos-mision">
          <span className="nos-mv-label">Misión</span>
          <h2>Acercar Apple a cada argentino</h2>
          <p>
            Queremos que acceder a un iPhone no sea un privilegio. Trabajamos
            cada día para ofrecer los mejores precios, financiación accesible y
            un servicio posventa que realmente acompaña al cliente.
            Cada persona de nuestro equipo conoce a fondo los productos que ofrecemos,
            eso nos permite asesorarte de verdad: sin humo, sin apuro, con la respuesta que necesitás
            antes de tomar una decisión.
          </p>
        </div>
        <div className="nos-mv-card nos-vision">
          <span className="nos-mv-label">Visión</span>
          <h2>Ser la tienda Apple de referencia en Latinoamérica</h2>
          <p>
            Soñamos con una red de sucursales y un e-commerce que pongan a
            Argentina en el mapa de la excelencia en retail tecnológico,
            combinando innovación, confianza y cercanía.
          </p>
        </div>
      </section>

      <section className="nos-numeros">
        <div className="nos-numero">
          <span className="nos-num">+12.000</span>
          <span className="nos-num-label">clientes satisfechos</span>
        </div>
        <div className="nos-numero">
          <span className="nos-num">+100</span>
          <span className="nos-num-label">sucursales en el país</span>
        </div>
        <div className="nos-numero">
          <span className="nos-num">6</span>
          <span className="nos-num-label">años en el mercado</span>
        </div>
        <div className="nos-numero">
          <span className="nos-num">4.9 ★</span>
          <span className="nos-num-label">calificación promedio</span>
        </div>
      </section>

      {/* POR QUE ELEGIRNOS */}
      <section className="nos-porque">
        <p className="eyebrow" style={{ textAlign: "center" }}>Por qué elegirnos</p>
        <h2 className="nos-porque-titulo">La diferencia en nuestra tienda</h2>

        <div className="nos-porque-grid">

          <div className="nos-porque-item">
            <BsCreditCard className="nos-porque-icon" />
            <h3>Hasta 12 cuotas sin interés</h3>
            <p>Financiación real, sin letra chica. Pagá tu iPhone de la forma que más te convenga.</p>
          </div>

          <div className="nos-porque-item">
            <BsTruck className="nos-porque-icon" />
            <h3>Envíos a todo el país</h3>
            <p>Despachamos en 24–72 hs. Seguimiento en tiempo real y embalaje seguro.</p>
          </div>

          <div className="nos-porque-item">
            <BsShieldCheck className="nos-porque-icon" />
            <h3>Compra 100% segura</h3>
            <p>Todos nuestros equipos son originales con garantía oficial. Tus datos, siempre protegidos.</p>
          </div>

          <div className="nos-porque-item">
            <BsShop className="nos-porque-icon" />
            <h3>Retiro gratis en tienda</h3>
            <p>Más de 100 sucursales para que retires tu pedido cuando quieras, sin costo extra.</p>
          </div>

          <div className="nos-porque-item">
            <BsStarFill className="nos-porque-icon" />
            <h3>Atención personalizada</h3>
            <p>Nuestro equipo de expertos te asesora antes, durante y después de tu compra.</p>
          </div>

          <div className="nos-porque-item">
            <BsAward className="nos-porque-icon" />
            <h3>Productos originales</h3>
            <p>Solo trabajamos con equipos Apple certificados. Garantía de autenticidad en cada compra.</p>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Nosotros;
