"use client";

import { Proyecto } from "@/models/Project";

type Props = {
  proyectos: Proyecto[];
};

export default function ProjectsTable({ proyectos }: Props) {
  if (proyectos.length === 0) {
    return <div className="p-6 text-center text-gray-500">No hay resultados.</div>;
  }

  return (
    <div className="mt-5">
      {/* Tabla - visible solo en sm en adelante */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Nombre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Provincia</th>
              <th>Localidad</th>
              <th>Calle</th>
              {/* Solo mostrar si esta inactivo con un hover de otro color en la celda, no esta todavia */}
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto: Proyecto) => (
              <tr key={proyecto.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{proyecto.nombre}</td>
                <td>
                  <span className="mr-1">{proyecto.icono_tipo}</span>
                  {proyecto.tipo}
                </td>
                <td><EstadoProyectoTag estado={proyecto.estado} color={proyecto.color_estado} /></td>
                <td>{formatearFecha(proyecto.fecha_inicio)}</td>
                <td>{proyecto.fecha_fin ? formatearFecha(proyecto.fecha_fin) : "-"}</td>
                <td>{proyecto.provincia}</td>
                <td>{proyecto.localidad}</td>
                <td>{proyecto.calle}</td>
                {/* Solo mostrar si esta inactivo con un hover de otro color en la celda, no esta todavia*/}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación (solo en desktop por ahora) */}
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

      {/* Cards - solo visible en mobile */}
      <div className="sm:hidden flex flex-col gap-4">
        {proyectos.map((proyecto) => (
          <div
            key={proyecto.id}
            className="border rounded-md p-4 shadow-sm bg-white"
          >
            <div className="font-semibold text-lg mb-1">{proyecto.nombre}</div>
            <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
              <span>{proyecto.icono_tipo}</span>
              <span>{proyecto.tipo}</span>
            </div>

            <div className="text-sm mb-1">
              <strong>Estado:</strong>{" "}
              <EstadoProyectoTag estado={proyecto.estado} color={proyecto.color_estado} />
            </div>
            <div className="text-sm mb-1">
              <strong>Inicio:</strong> {formatearFecha(proyecto.fecha_inicio)}
            </div>
            <div className="text-sm mb-1">
              <strong>Fin:</strong>{" "}
              {proyecto.fecha_fin ? formatearFecha(proyecto.fecha_fin) : "-"}
            </div>
            <div className="text-sm mb-1">
              <strong>Provincia:</strong> {proyecto.provincia}
            </div>
            <div className="text-sm mb-1">
              <strong>Localidad:</strong> {proyecto.localidad}
            </div>
            <div className="text-sm mb-1">
              <strong>Calle:</strong> {proyecto.calle}
            </div>

            {/* Solo mostrar si esta inactivo con el tag a la derecha del nombre, no esta todavia */}
          </div>
        ))}
      </div>
    </div>
  );
}

function EstadoTag({ activo }: { activo: boolean }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        activo ? "bg-black text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

function EstadoProyectoTag({ estado, color }: { estado?: string; color?: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full bg-black text-white`}>
      {estado}
    </span>
  );
}

function formatearFecha(fecha: string) {
  const f = new Date(fecha);
  return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
}
