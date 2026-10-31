import { useEffect, useState } from 'react';
import { getProductDetail } from '../service/productService';

export default function useProductDetail(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelado = false;
        async function cargar() {
            try {
                setLoading(true);
                setError(null);
                const data = await getProductDetail(id);
                if (!cancelado) setProduct(data);
            } catch (err) {
                if (!cancelado) setError(err.message);
            } finally {
                if (!cancelado) setLoading(false);
            }
        }

        cargar();
        return () => { cancelado = true; };
    }, [id]);

    return { product, loading, error };
}