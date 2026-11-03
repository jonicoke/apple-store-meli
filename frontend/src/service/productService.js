
const URL_BASE = "/api/products";

export async function searchProducts(query) {

    const response = await fetch(
        `/api/products/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error(
            "Error en la búsqueda de productos"
        );
    }

    return response.json();
}
export async function getCategory(query) {
    try {
        // 1. Hacer el fetch al endpoint de búsqueda
        const response = await fetch(`${URL_BASE}/category?query=${encodeURIComponent(query)}`);
        // 2. Comprobar si la respuesta fue exitosa
        if(!response.ok) { 
            throw new Error("Error en la búsqueda de categoría")
        }
        // 3. Convertir la respuesta a JSON
        const data = await response.json();
        // 4. Devolver los datos
        return data;
    } catch (error) {
        throw error;
    }
}
export async function getProductsByCategory(query, domainId) {
        try {
        const response = await fetch(
            `${URL_BASE}/category/products?query=${encodeURIComponent(query)}&categoryId=${encodeURIComponent(domainId)}`);

        if(!response.ok) { 
            throw new Error("Error en la búsqueda de categoría")
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}
export async function getProductDetail(id) {
    const response = await fetch(`${URL_BASE}/${encodeURIComponent(id)}`);
    if (!response.ok) {
        throw new Error(`No se pudo cargar el producto (${response.status})`);
    }
    return response.json();
}