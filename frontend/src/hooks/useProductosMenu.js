import { useEffect, useState } from "react";
import { getCategory, getProductsByCategory } from "../service/productService";

// Cache en memoria del front: query -> primeros 3 productos.
// Evita volver a pedir al back cada vez que el mouse pasa por la misma línea.
const cache = new Map();

export default function useProductosMenu(query) {
  const [productos, setProductos] = useState(cache.get(query) ?? []);
  const [loading, setLoading] = useState(!cache.has(query));

  useEffect(() => {
    if (!query) return;

    // Ya lo teníamos: lo mostramos al instante
    if (cache.has(query)) {
      setProductos(cache.get(query));
      setLoading(false);
      return;
    }

    let cancelado = false;
    setLoading(true);

    // Espera 300 ms: si el mouse sigue de largo, el timer se cancela y no se pide nada
    const timer = setTimeout(async () => {
      try {
        const categorias = await getCategory(query);
        const lista = await getProductsByCategory(query, categorias[0].domain_id);
        const top = Array.isArray(lista) ? lista.slice(0, 3) : [];
        cache.set(query, top);
        if (!cancelado) setProductos(top);
      } catch (err) {
        if (!cancelado) setProductos([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }, 300);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { productos, loading };
}