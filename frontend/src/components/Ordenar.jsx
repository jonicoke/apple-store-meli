import { useState } from 'react'

const opciones = [
    { valor: "nuevos", label: "Nuevos" },
    { valor: "mayor",      label: "Mayor precio" },
    { valor: "menor",      label: "Menor precio" },
]

function Ordenar({ orden, setOrden, inline = false }) {
    const [abierto, setAbierto] = useState(false)

    const labelActual = opciones.find(o => o.valor === orden)?.label

    // Modo inline: lista visible directamente (para el panel mobile)
    if (inline) {
        return (
            <ul className="ordenar-opciones ordenar-opciones--inline">
                {opciones.map(op => (
                    <li
                        key={op.valor}
                        className={`ordenar-opcion ${orden === op.valor ? "activa" : ""}`}
                        onClick={() => setOrden(op.valor)}
                    >
                        {op.label}
                    </li>
                ))}
            </ul>
        )
    }

    // Modo normal: dropdown
    return (
        <div className="ordenar-contenedor">
            <div className="ordenar-selector" onClick={() => setAbierto(!abierto)}>
                <span>Ordenar por : {labelActual}</span>
            </div>

            {abierto && (
                <ul className="ordenar-opciones">
                    {opciones.map(op => (
                        <li
                            key={op.valor}
                            className={`ordenar-opcion ${orden === op.valor ? "activa" : ""}`}
                            onClick={() => { setOrden(op.valor); setAbierto(false) }}
                        >
                            {op.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Ordenar