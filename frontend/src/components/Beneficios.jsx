import "../styles/pages/inicio.css";
import {
  BsCreditCard,
  BsTruck,
  BsShieldCheck,
  BsShop,
} from "react-icons/bs";

function Beneficios() {
  return (
    <section className="beneficios">

      <div className="beneficio">
        <BsCreditCard className="beneficio-icon" />
        <div>
          <h4>Hasta 12 cuotas sin interés</h4>
          <a href="#">Ver promociones</a>
        </div>
      </div>

      <div className="beneficio">
        <BsTruck className="beneficio-icon" />
        <div>
          <h4>Envíos a todo el país</h4>
          <a href="#">Conocé más</a>
        </div>
      </div>

      <div className="beneficio">
        <BsShieldCheck className="beneficio-icon" />
        <div>
          <h4>Compra 100% segura</h4>
          <a href="#">Tus datos protegidos</a>
        </div>
      </div>

      <div className="beneficio">
        <BsShop className="beneficio-icon" />
        <div>
          <h4>Retiro gratis en tienda</h4>
          <a href="#">Más de 100 sucursales</a>
        </div>
      </div>

    </section>
  );
}

export default Beneficios;