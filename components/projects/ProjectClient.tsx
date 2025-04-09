'use client'

import { Proyecto } from "@/models/Project";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { FiltrosDropdown } from "../FiltrosDropdown";
import { AgruparPorDropdown } from "../AgruparPorDropdown";
import ProjectsTable from "./ProjectTable";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
    proyectos: Proyecto[];
}

export default function ProjectsClient(props: Props) {
    const proyectos = props.proyectos;
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCliente, setFiltroCliente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    const proyectosFiltrados = useMemo(() => {
        return props.proyectos;

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
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Proyectos</h1>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link href="/projects/new">
                        <Button className="gap-2 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            <p className="hidden sm:inline">Nuevo proyecto</p>
                        </Button>
                    </Link>
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

            {/* Tabla de proyectos */}
            <ProjectsTable proyectos={proyectos} />
        </div>
    );

}