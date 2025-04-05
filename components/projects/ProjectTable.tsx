"use client";

import {Proyecto} from "@/models/Project";

type Props = {
    proyectos: Proyecto[];
};

export default function ProjectsTable({ proyectos }: Props) {
    return (proyectos.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No hay resultados.</div>
            ) : (
                <div className="rounded-md border mt-5">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="p-4">ID</th>
                            <th>Nombre</th>
                            <th>Cliente</th>
                            <th>Inicio</th>
                            <th>Estado</th>
                            <th>Tipo</th>
                            <th>Etiquetas</th>
                            <th>Visitas</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proyectos.map((proyecto: Proyecto) => (
                            <tr key={proyecto.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-gray-500">{proyecto.id}</td>
                                <td className="font-medium">{proyecto.nombre}</td>
                                <td>{proyecto.cliente}</td>
                                <td>{formatearFecha(proyecto.fecha_inicio)}</td>
                                <td>
                                    <EstadoTag estado={proyecto.estado}/>
                                </td>
                                <td>{proyecto.tipo}</td>
                                <td>
                                    <div className="flex flex-wrap gap-1">
                                        {proyecto.etiquetas.map((etiqueta, i) => (
                                            <span
                                                key={i}
                                                className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                                            >
        {etiqueta}
      </span>
                                        ))}
                                    </div>
                                </td>
                                <td>{proyecto.visitas}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Paginación simulada */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <label htmlFor="perPage">Mostrar</label>
                            <select id="perPage" className="border rounded px-2 py-1 text-sm">
                                <option>5</option>
                                <option>10</option>
                                <option>20</option>
                            </select>
                            <span>por página</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-1 px-2 border rounded">&laquo;</button>
                            <button className="p-1 px-3 border rounded font-bold bg-gray-100">1</button>
                            <button className="p-1 px-2 border rounded">&raquo;</button>
                        </div>
                    </div>
                </div>
            )
    );
}

function EstadoTag({estado}: { estado: Proyecto["estado"] }) {
    const isActivo = estado === "Activo";
    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full ${
                isActivo
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
            }`}
        >
      {estado === "Activo" ? "Sí" : estado === "Finalizado" ? "No" : estado}
    </span>
    );
}

function formatearFecha(fecha: string) {
    const f = new Date(fecha);
    return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
}
