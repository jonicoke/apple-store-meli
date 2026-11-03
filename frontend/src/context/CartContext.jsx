import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("carrito");
        return guardado ? JSON.parse(guardado) : [];
    });

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(p => p.id === producto.id);

            if (existe) {
                return prev.map(p =>
                    p.id === producto.id
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                );
            }

            return [
                ...prev,
                {
                    ...producto,
                    cantidad: 1
                }
            ];
        });
    };

    const aumentarCantidad = (id) => {
        setCarrito(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, cantidad: p.cantidad + 1 }
                    : p
            )
        );
    };

    const disminuirCantidad = (id) => {
        setCarrito(prev =>
            prev
                .map(p =>
                    p.id === id
                        ? { ...p, cantidad: p.cantidad - 1 }
                        : p
                )
                .filter(p => p.cantidad > 0)
        );
    };

    const eliminarProducto = (id) => {
        setCarrito(prev =>
            prev.filter(p => p.id !== id)
        );
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const confirmarCompra = () => {
        setCarrito([]);
    };

    const cantidadTotal = carrito.reduce(
        (acc, p) => acc + p.cantidad,
        0
    );

    const total = carrito.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0
    );

    return (
        <CartContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                aumentarCantidad,
                disminuirCantidad,
                eliminarProducto,
                vaciarCarrito,
                confirmarCompra,
                cantidadTotal,
                total
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);