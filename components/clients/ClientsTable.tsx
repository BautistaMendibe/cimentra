"use client";

import { useRouter } from "next/navigation";
import Cliente from "@/models/Cliente";
import { Loader2 } from "lucide-react";

type Props = {
  clientes: Cliente[];
  onClienteClick: (cliente: Cliente) => void;
  loading: boolean;
};

export default function ClientsTable({ clientes, onClienteClick, loading }: Props) {

  const router = useRouter();

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center text-gray-500">
        <Loader2 className="animate-spin mr-2 h-5 w-5" />
      </div>
    );
  }

  if (clientes.length === 0 && !loading) {
    return <div className="p-6 text-center text-gray-500">No hay resultados.</div>;
  }

  return (
    <div className="mt-5">
      {/* Tabla - visible solo en sm en adelante */}
      <div className=" overflow-auto max-h-[70vh] hidden sm:block rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Mail</th>
              <th className="p-4">Teléfono</th>
              <th></th>
              {/* Solo mostrar si esta inactivo con un hover de otro color en la celda, no esta todavia */}
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente: Cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onClienteClick(cliente)}>
                <td className="p-4 font-medium">{cliente.nombre + ' ' + cliente.apellido}</td>
                <td>{cliente.email ?? '-'}</td>
                <td>{cliente.telefono ?? '-'}</td>
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
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="border rounded-md p-4 shadow-sm bg-white"
            onClick={() => onClienteClick(cliente)}
          >
            <div className="font-semibold text-lg mb-1">{cliente.nombre + ' ' + cliente.apellido}</div>
            <div className="text-sm mb-1">
              <strong>Mail:</strong> {cliente.email ?? '-'}
            </div>
            <div className="text-sm mb-1">
              <strong>Teléfono:</strong> {cliente.telefono ?? '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
