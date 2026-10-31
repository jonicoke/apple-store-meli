import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useSearchParams } from "react-router-dom";


function BotonAgregar({ producto, agregarAlCarrito, stockActual }) {
    const [estado, setEstado] = useState('normal');
    const agotado = stockActual <= 0;

    if (agotado) {
        return (
            <button className="card-boton disabled" disabled>
                Agotado
            </button>
        );
    }

    const handleAgregar = () => {
        if (estado !== 'normal') return;
        setEstado('cargando');
        setTimeout(() => {
            agregarAlCarrito(producto);
            setEstado('exito');
            setTimeout(() => setEstado('normal'), 2000);
        }, 1000);
    };

    return (
        
        <button
            className={`card-boton ${estado === 'cargando' ? 'cargando' : ''} ${estado === 'exito' ? 'exito' : ''}`}
            onClick={handleAgregar}
            disabled={estado !== 'normal'}
        >
            {estado === 'normal' && "Agregar al carrito"}
            {estado === 'cargando' && (
                <>
                    <span className="spinner-carrito"></span>
                    Añadiendo...
                </>
            )}
            {estado === 'exito' && "✓ ¡Añadido!"}
        </button>
    );
}

function Cards({ productos = [], seleccionados, datos = [], cat, precioMin, precioMax, orden }) {
    const [visibles, setVisibles] = useState(10);
    const { agregarAlCarrito, stocks } = useCart();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const busqueda = searchParams.get("busqueda") || "";

    const between = (valor, min, max) => valor >= min && valor <= max;

    const productosAdaptados = productos.map(producto => ({
        ...producto,
        nombre: producto.nombre ?? "Producto sin nombre",
        precio: producto.precio ?? null,
        enlace: producto.enlaceCompra ?? "",
    }));

    const base = productosAdaptados

    if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const base = q
            ? productosAdaptados.filter(p => p.nombre.toLowerCase().includes(q))
            : productosAdaptados;
    }
    const normalizar = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");
    const porFiltros = base.filter((p) =>
        datos.every((filtro) => {
            const marcadas = filtro.opciones.filter((o) => seleccionados?.[o]);
            if (marcadas.length === 0) return true;   // nada marcado: no filtra

            const valor = normalizar(filtro.spec ? p.specs?.[filtro.spec] : p.nombre);
            return marcadas.some((o) => valor.includes(normalizar(o)));
        })
    );
    const porPrecio = porFiltros.filter(producto => {
        if (producto.precio === null) return true;
        const filtrados = between(producto.precio, precioMin, precioMax); 
        return filtrados;
    })

    const productosOrdenados = [...porPrecio].sort((a, b) => {
        if (orden === "mayor") {
            return (b.precio ?? 0) - (a.precio ?? 0);
        }
        if (orden === "menor") {
            return (a.precio ?? 0) - (b.precio ?? 0);
        }
        return 0;
    });

    const productosMostrados = productosOrdenados.slice(0, visibles);

    return (
    <div className="cards-contenedor">

        <p className="cards-cantidad">
            {productosOrdenados.length}{" "}
            {productosOrdenados.length === 1 ? "producto" : "productos"}
        </p>

        <div className="cards-grid">
            {productosMostrados.map(producto => {
                const stockActual = stocks[producto.id] ?? 0;

                return (
                    <div className="card" key={producto.id}>

                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="card-imagen"
                            loading="lazy"
                        />

                        {/* Info */}
                        <div className="card-info">
                            <p className="card-nombre">
                                {producto.nombre}
                            </p>

                            {/* Precios */}
                            <div className="card-precio">
                                <p className="card-precio">
                                    {producto.precio !== null
                                        ? `$ ${producto.precio.toLocaleString("es-AR")}`
                                        : "Consultar precio"}
                                </p>
                            </div>
                        </div>

                        {/* Acciones */}
                         <button className="card-detalles" onClick={() => navigate(`/producto/${producto.id}`)}>
                            Ver detalles
                        </button>

                        <BotonAgregar
                            producto={producto}
                            agregarAlCarrito={agregarAlCarrito}
                            stockActual={stockActual}
                        />
                    </div>
                );
            })}
        </div>

        {visibles < productosOrdenados.length && (
            <button
                className="ver-mas-boton"
                onClick={() => setVisibles(visibles + 8)}
            >
                Ver más
            </button>
        )}
    </div>
);}

export default Cards;