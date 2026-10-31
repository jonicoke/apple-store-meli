import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/components/navBar.css'
import './styles/pages/productos.css'
import './styles/components/carrusel.css'
import './styles/components/filaProductos.css'
import './styles/temaOscuro.css'
import './styles/components/beneficios.css'
import './styles/pages/contacto.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
// icons bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from "react";

import { TemaProvider } from "./context/TemaContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TemaProvider>
      <App />
    </TemaProvider>
  </StrictMode>
);
