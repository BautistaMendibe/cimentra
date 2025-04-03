export type Proyecto = {
    id: string
    nombre: string
    cliente: string
    fecha_inicio: string
    estado: "Creado" | "Presupuestado" | "Activo" | "En pausa" | "Finalizado"
    tipo: "Mensura" | "Arquitectura" | "Ingeniería" | "Construcción" | "Varios"
    etiquetas: string[]
    visitas: number
}

export const proyectosMock: Proyecto[] = [
    {
        id: "1",
        nombre: "Edificio Belgrano",
        cliente: "juan@ejemplo.com",
        fecha_inicio: "2023-01-15",
        estado: "Activo",
        tipo: "Construcción",
        etiquetas: ["cliente", "premium", "urgente"],
        visitas: 12,
    },
    {
        id: "2",
        nombre: "Topografía Ruta 9",
        cliente: "maria@ejemplo.com",
        fecha_inicio: "2022-11-20",
        estado: "Presupuestado",
        tipo: "Mensura",
        etiquetas: ["cliente", "licitación"],
        visitas: 7,
    },
    {
        id: "3",
        nombre: "Casa Familiar Norte",
        cliente: "carlos@ejemplo.com",
        fecha_inicio: "2023-03-05",
        estado: "Creado",
        tipo: "Arquitectura",
        etiquetas: ["particular", "nuevo"],
        visitas: 3,
    },
    {
        id: "4",
        nombre: "Puente Río Primero",
        cliente: "ana@ejemplo.com",
        fecha_inicio: "2023-02-18",
        estado: "Activo",
        tipo: "Ingeniería",
        etiquetas: ["cliente", "prioridad alta"],
        visitas: 19,
    },
    {
        id: "5",
        nombre: "Reforma Local Centro",
        cliente: "pedro@ejemplo.com",
        fecha_inicio: "2022-12-10",
        estado: "Finalizado",
        tipo: "Varios",
        etiquetas: ["cliente", "regular", "finalizado"],
        visitas: 28,
    },
]
