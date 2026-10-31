
import { useEffect, useState } from 'react';
import { getProductsByCategory, getCategory } from '../service/productService';

const categoriasBusqueda = {
    iphone: 'iPhone 17',
    audio: 'AirPods Pro',
    computación: 'MacBook Air M4',
    accesorios: 'Apple Watch',
    ofertas: 'iPhone 16',
};

export default function useProductos(cat) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProductos = async () => {
            const query = categoriasBusqueda[cat];

            if (!query) {
                setProducts([]);
                setError(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const category = await getCategory(query);

                if (!category || category.length === 0) {
                    throw new Error('No se encontró una categoría para la búsqueda');
                }

                const domainId = category[0].domain_id;
                const result = await getProductsByCategory(query, domainId);
                if (!Array.isArray(result)) {
                    throw new Error('La respuesta de productos no tiene el formato esperado');
                }

                setProducts(result);
            } catch (err) {
                console.error('Error al cargar productos:', err);
                setProducts([]);
                setError(err.message || 'No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [cat]);

    return { products, loading, error };
}
