import { useState } from 'react'

function Filtros({ datos, conteos, seleccionados, setSeleccionados, precioMin, setPrecioMin, precioMax, setPrecioMax, precioLimite }) {
    const [abiertos,      setAbiertos]      = useState({})
    const [precioAbierto, setPrecioAbierto] = useState(false)

    const toggleFiltro = (nombre) => {
        setAbiertos({ ...abiertos, [nombre]: !abiertos[nombre] })
    }

    const toggleOpcion = (opcion) => {
        setSeleccionados({ ...seleccionados, [opcion]: !seleccionados[opcion] })
    }

    return (
        <div className="tarjetaFiltro">
            <h5 className="tarjetaFiltro-subtitulo">Categorías</h5>
            <nav>
                <ul className="tarjetaFiltro-lista">

                    <li>
                        <div className="filtro-titulo" onClick={() => setPrecioAbierto(!precioAbierto)}>
                            Precio
                            <span className={`flecha ${precioAbierto ? "rotada" : ""}`}>⌄</span>
                        </div>
                        <div className={`opciones precio-opciones ${precioAbierto ? "abierto" : ""}`}>
                            <div className="precio-track">
                                <div className="precio-track-fill" style={{
                                    left: `${(precioMin / precioLimite) * 100}%`,
                                    width: `${((precioMax - precioMin) / precioLimite) * 100}%`
                                }} />
                                <input type="range" min={0} max={precioLimite} value={precioMin}
                                    onChange={(e) => { const val = Number(e.target.value); if (val < precioMax) setPrecioMin(val) }}
                                />
                                <input type="range" min={0} max={precioLimite} value={precioMax}
                                    onChange={(e) => { const val = Number(e.target.value); if (val > precioMin) setPrecioMax(val) }}
                                />
                            </div>
                            <p className="precio-rango-label">${precioMin.toLocaleString()} – ${precioMax.toLocaleString()}</p>
                        </div>
                    </li>

                    {datos.map((filtro) => (
                        <li key={filtro.id}>
                            <div className="filtro-titulo" onClick={() => toggleFiltro(filtro.id)}>
                                {filtro.titulo}
                                <span className={`flecha ${abiertos[filtro.id] ? "rotada" : ""}`}>⌄</span>
                            </div>
                            <ul className={`opciones ${abiertos[filtro.id] ? "abierto" : ""}`}>
                                {filtro.opciones.map((opcion) => {
                                    const cantidad = conteos?.[opcion] ?? 0;
                                    const sinProductos = cantidad === 0 && !seleccionados[opcion];

                                    return (
                                        <li key={opcion} style={{ opacity: sinProductos ? 0.4 : 1 }}>
                                            <input
                                                type="checkbox"
                                                id={`${filtro.id}-${opcion}`}
                                                checked={!!seleccionados[opcion]}
                                                disabled={sinProductos}
                                                onChange={() => toggleOpcion(opcion)}
                                            />
                                            <label htmlFor={`${filtro.id}-${opcion}`}>
                                                {opcion} ({cantidad})
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}

                </ul>
            </nav>
        </div>
    )
}

export default Filtros