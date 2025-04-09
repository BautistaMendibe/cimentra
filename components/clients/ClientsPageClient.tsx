'use client'

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { FiltrosDropdown } from "../FiltrosDropdown";
import { AgruparPorDropdown } from "../AgruparPorDropdown";
import Cliente from "@/models/Cliente";
import ClientsTable from "./ClientsTable";
import ClienteSidePanel from "./ClienteSidePanel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type Props = {
    clientes: Cliente[];
    loading: boolean;
}

export default function ClientsPageClient(props: Props) {
    const clientes = props.clientes;
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCliente, setFiltroCliente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)


    const clientesFiltrados = useMemo(() => {
        return props.clientes;

        //proyectos.filter((proy) => {
        //    const matchNombre = proy.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        //    const matchCliente = proy.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
        //    const matchTipo = proy.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
        //    return matchNombre && matchCliente && matchTipo;
        //});
    }, [filtroNombre, filtroCliente, filtroTipo]);

    return (
        <div className="p-4 sm:p-6">
            {/* Header: título + botones */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl sm:text-4xl font-bold">Clientes</h1>

                <TooltipProvider>
                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="gap-2 p-2 sm:w-auto w-full" size="icon" onClick={() => setClienteSeleccionado({} as Cliente)}>
                                    <Plus className="h-4 w-4" />
                                    <p className="hidden sm:inline">Nuevo cliente</p>
                                </Button>
                            </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Descargar CSV</TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>

            {/* Filtros y búsqueda */}
            <div className="w-full max-w-md mb-5">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Buscar por Id (aún no implementado)"
                        className="pl-9"
                        disabled
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mb-4 pt-5">
                    <FiltrosDropdown
                        filtroNombre={filtroNombre}
                        setFiltroNombre={setFiltroNombre}
                        filtroCliente={filtroCliente}
                        setFiltroCliente={setFiltroCliente}
                        filtroTipo={filtroTipo}
                        setFiltroTipo={setFiltroTipo}
                    />
                    <AgruparPorDropdown />
                </div>
            </div>

            <div className="relative">
                {/* Tabla de clientes */}
                <div >
                    <ClientsTable
                        clientes={clientes}
                        onClienteClick={(cliente) => setClienteSeleccionado(cliente)}
                        loading={props.loading}
                    />
                </div>

                {/* Pantalla lateral para ver detalles y editar */}
                {clienteSeleccionado && (
                    <ClienteSidePanel
                        cliente={clienteSeleccionado}
                        onClose={() => setClienteSeleccionado(null)}
                    />
                )}
            </div>
        </div>
    );

}