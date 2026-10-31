import { createContext, useContext, useEffect, useState } from "react";
import { productos as productosIniciales } from "../data/productos";

const CartContext = createContext();

export function CartProvider({ children }) {

    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("carrito");
        return guardado ? JSON.parse(guardado) : [];
    });

    const [stocks, setStocks] = useState(() => {
    const inicial = {};
    productosIniciales.forEach(p => { inicial[p.id] = p.stock ?? 0 });
    
    // Descontar lo que ya está en el carrito guardado
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        const carritoParsed = JSON.parse(carritoGuardado);
        carritoParsed.forEach(p => {
            if (inicial[p.id] !== undefined) {
                inicial[p.id] = Math.max(0, inicial[p.id] - p.cantidad);
            }
        });
    }
    
    return inicial;
});

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        if ((stocks[producto.id] ?? 0) <= 0) return;

        setStocks(prev => ({
            ...prev,
            [producto.id]: prev[producto.id] - 1
        }));

        setCarrito(prev => {
            const existe = prev.find(p => p.id === producto.id);
            if (existe) {
                return prev.map(p =>
                    p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const aumentarCantidad = (id) => {
        const stockDisponible = stocks[id] ?? 0;
        if (stockDisponible <= 0) return;

        setStocks(prev => ({ ...prev, [id]: prev[id] - 1 }));
        setCarrito(prev =>
            prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)
        );
    };

    const disminuirCantidad = (id) => {
        setStocks(prev => ({ ...prev, [id]: prev[id] + 1 }));
        setCarrito(prev =>
            prev
                .map(p => p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p)
                .filter(p => p.cantidad > 0)
        );
    };

    const eliminarProducto = (id) => {
        const enCarrito = carrito.find(p => p.id === id);
        if (enCarrito) {
            setStocks(prev => ({ ...prev, [id]: prev[id] + enCarrito.cantidad }));
        }
        setCarrito(prev => prev.filter(p => p.id !== id));
    };

    const vaciarCarrito = () => {
        setStocks(prev => {
            const nuevo = { ...prev };
            carrito.forEach(p => { nuevo[p.id] = nuevo[p.id] + p.cantidad });
            return nuevo;
        });
        setCarrito([]);
    };

    const confirmarCompra = () => {
        setCarrito([]);
    };

    const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    return (
        <CartContext.Provider value={{
            carrito,
            stocks,
            agregarAlCarrito,
            aumentarCantidad,
            disminuirCantidad,
            eliminarProducto,
            vaciarCarrito,
            confirmarCompra,
            cantidadTotal,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);