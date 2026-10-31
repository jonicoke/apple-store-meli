import FilaProductos from "../components/FilaProductos";
import Beneficios from "../components/Beneficios";

function Inicio() {
  return (
    <main className="inicio">

      <FilaProductos
       titulo="Productos más vendidos"
        subtitulo="Los favoritos de nuestros clientes"
        categoria="iphone"
      />

      {/* <CarruselProductos /> */}
      <Beneficios />
      <FilaProductos
        titulo="Computación"
        subtitulo="MacBook, Mac Mini y más"
        categoria="computación"
      />

      <FilaProductos
        titulo="Audio"
        subtitulo="AirPods para cada estilo"
        categoria="audio"
      />

      <FilaProductos
        titulo="Accesorios"
        subtitulo="Cargadores, fundas y más"
        categoria="accesorios"
      />

    </main>
  );
}

export default Inicio;