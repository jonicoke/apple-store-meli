export const filtrosMoviles = [
    { id: "modelo",         titulo: "Modelo",         opciones: ["iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17"] },
    { id: "almacenamiento", titulo: "Almacenamiento", spec: "INTERNAL_MEMORY", opciones: ["128GB", "256GB", "512GB"] },
    { id: "color",          titulo: "Color",          spec: "MAIN_COLOR",      opciones: ["Negro", "Blanco", "Verde", "Azul"] },
]

export const filtrosAudio = [
    { id: "modelo",      titulo: "Modelo",              campo: "nombre",      opciones: ["AirPods 2", "AirPods 3", "AirPods 4", "AirPods Pro", "AirPods Max"] },
    { id: "cancelacion", titulo: "Cancelacion de ruido", campo: "cancelacion", opciones: ["Sí", "No"] },
    { id: "conector",    titulo: "Conector",             campo: "conector",    opciones: ["Lightning", "USB-C", "Bluetooth"] },
]

export const filtrosComputacion = [
    { id: "modelo",         titulo: "Modelo",         opciones: ["MacBook Air", "MacBook Pro", "iMac", "Mac Mini"] },
    { id: "chip",           titulo: "Chip",           spec: "PROCESSOR_MODEL",                  opciones: ["M1", "M2", "M3", "M4"] },
    { id: "ram",            titulo: "RAM",            spec: "RAM_MEMORY_MODULE_TOTAL_CAPACITY", opciones: ["8GB", "16GB", "24GB", "32GB"] },
    { id: "almacenamiento", titulo: "Almacenamiento", spec: "SSD_DATA_STORAGE_CAPACITY",        opciones: ["256GB", "512GB", "1TB", "2TB"] },
]
export const filtrosAccesorios = [
    { id: "tipo",       titulo: "Tipo",          campo: "tipo",       opciones: ["MagSafe", "Cases", "Cables", "Apple Watch"] },
    { id: "compatible", titulo: "Compatible", campo: "compatible", opciones: ["Iphone", "iPad", "Mac"] },
]

export const filtrosOfertas = [
    {id: "categoria", titulo: "Categoría", campo: "categoria", exacto: true, opciones: ["iPhone", "Audio", "Computación", "Accesorios"]}
]

