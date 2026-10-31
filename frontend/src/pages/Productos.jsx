
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Filtros from '../components/Filtros';
import Cards from '../components/Cards';
import Ordenar from '../components/Ordenar';

import {
    filtrosOfertas,
    filtrosAccesorios,
    filtrosComputacion,
    filtrosAudio,
    filtrosMoviles
} from '../data/filtros';

import useProducts from '../hooks/useProducts';

const mapaFiltros = {
    iphone: filtrosMoviles,
    audio: filtrosAudio,
    computación: filtrosComputacion,
    accesorios: filtrosAccesorios,
    ofertas: filtrosOfertas,
};

const PRECIO_LIMITE = 5000000;

function Productos() {
    const [searchParams] = useSearchParams();
    const cat = searchParams.get('cat');

    const filtrosActivos = mapaFiltros[cat] || [];

    const { products, loading, error } = useProducts(cat);
    const conteos = {};

    const [seleccionados, setSeleccionados] = useState({});
    const [precioMin, setPrecioMin] = useState(0);
    const [precioMax, setPrecioMax] = useState(PRECIO_LIMITE);
    const [orden, setOrden] = useState('nuevos');
    const [panelAbierto, setPanelAbierto] = useState(null);
    const normalizar = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, "");

    const togglePanel = (nombre) => {
        setPanelAbierto(prev =>
            prev === nombre ? null : nombre
        );
    };

    const handleOrden = (valor) => {
        setOrden(valor);
        setPanelAbierto(null);
    };

    useEffect(() => {
        setSeleccionados({});
        setPrecioMin(0);
        setPrecioMax(PRECIO_LIMITE);
        setPanelAbierto(null);
    }, [cat]);

    filtrosActivos.forEach((filtro) => {
        filtro.opciones.forEach((opcion) => {
            conteos[opcion] = products.filter((p) => {
                const valor = normalizar(filtro.spec ? p.specs?.[filtro.spec] : p.nombre);
                return valor.includes(normalizar(opcion));
            }).length;
        });
    });
    const filtrosProps = {
        datos: filtrosActivos,
        conteos,
        seleccionados,
        setSeleccionados,
        precioMin,
        setPrecioMin,
        precioMax,
        setPrecioMax,
        precioLimite: PRECIO_LIMITE,
    };

    return (
        <div className="pagina-productos">
            <div className="filtros-desktop">
                <Filtros {...filtrosProps} />
            </div>

            <div className="cards-contenedor-wrapper">
                <div className="ordenar-desktop">
                    <Ordenar
                        orden={orden}
                        setOrden={setOrden}
                    />
                </div>

                {/* Barra para móvil */}
                <div className="mobile-toolbar">
                    <div className="mobile-toolbar-inner">
                        <button
                            className={`mobile-toolbar-btn ${
                                panelAbierto === 'categorias' ? 'activo' : ''
                            }`}
                            onClick={() => togglePanel('categorias')}
                        >
                            ⠿ Categorías
                        </button>

                        <button
                            className={`mobile-toolbar-btn ${
                                panelAbierto === 'ordenar' ? 'activo' : ''
                            }`}
                            onClick={() => togglePanel('ordenar')}
                        >
                            ≡ Filtros
                        </button>
                    </div>

                    {panelAbierto === 'categorias' && (
                        <div className="mobile-panel">
                            <Filtros {...filtrosProps} />
                        </div>
                    )}

                    {panelAbierto === 'ordenar' && (
                        <div className="mobile-panel">
                            <Ordenar
                                orden={orden}
                                setOrden={handleOrden}
                                inline={true}
                            />
                        </div>
                    )}
                </div>

                {loading && <p>Cargando productos...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && (
                    <Cards productos={products} 
                            datos={filtrosActivos}
                            seleccionados={seleccionados}
                            precioMin={precioMin}
                            precioMax={precioMax}
                            orden={orden}
                            />
                )}
            </div>
        </div>
    );
}

export default Productos;
