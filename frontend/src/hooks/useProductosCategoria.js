import { useEffect, useState } from "react";
import {
  getCategory,
  getProductsByCategory,
} from "../service/productService";

const consultasPorCategoria = {
    iphone: 'iPhone 17',
    audio: 'AirPods Pro',
    computación: 'MacBook Air',
    accesorios: 'Apple Watch',
    ofertas: 'iPhone 16',
};

function useProductosCategoria(categoria) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      try {
        setLoading(true);
        setError(null);
        const clave = categoria.toLowerCase().trim();
        const query = consultasPorCategoria[clave];

        if (!query) {
          throw new Error(`Categoría no configurada: ${categoria}`);
        }

        const categorias = await getCategory(query);

        if (!categorias?.length) {
          throw new Error("No se encontró la categoría");
        }

        const domainId = categorias[0].domain_id;

        const resultado = await getProductsByCategory(query, domainId);

       if (!cancelado) {
          setProductos(Array.isArray(resultado) ? resultado : []);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    }

    cargarProductos();

    return () => {
      cancelado = true;
    };
  }, [categoria]);

  return { productos, loading, error };
}

export default useProductosCategoria;