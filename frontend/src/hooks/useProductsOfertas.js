import { useEffect, useState } from "react";
import { getCategory, getProductsByCategory,} from "../service/productService";

function useProductosOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        setLoading(true);
        setError(null);

        const category = await getCategory("Apple");

        if (!category?.length) {
          throw new Error("No se encontró una categoría");
        }

        const domainId = category[0].domain_id;

        const result = await getProductsByCategory(
          "iPhone",
          domainId
        );

        const productos = result?.results ?? [];

        // TODO: adaptar este filtro cuando definamos
        // cómo identificar las ofertas de Mercado Libre.
        setOfertas(productos);
      } catch (err) {
        console.error("Error cargando ofertas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarOfertas();
  }, []);

  return { ofertas, loading, error };
}

export default useProductosOfertas;
