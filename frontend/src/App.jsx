import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Nosotros from "./pages/Nosotros";
import Carrito from "./pages/Carrito";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import DetalleProducto from "./pages/DetalleProducto";
import BtnScrollTop from "./components/BtnScrollTop";

import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Carrito />} />
          
        </Routes>
        <BtnScrollTop />
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;