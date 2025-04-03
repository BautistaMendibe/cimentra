"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

type Props = {
    filtroNombre: string;
    setFiltroNombre: (val: string) => void;
    filtroCliente: string;
    setFiltroCliente: (val: string) => void;
    filtroTipo: string;
    setFiltroTipo: (val: string) => void;
};

export function FiltrosDropdown({
                                    filtroNombre,
                                    setFiltroNombre,
                                    filtroCliente,
                                    setFiltroCliente,
                                    filtroTipo,
                                    setFiltroTipo,
                                }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
                <div className="space-y-3">
                    <h3 className="text-sm font-medium">Filtrar proyectos</h3>
                    <Input
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <Input
                        placeholder="Buscar por cliente..."
                        value={filtroCliente}
                        onChange={(e) => setFiltroCliente(e.target.value)}
                    />
                    <Input
                        placeholder="Buscar por tipo..."
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    />
                    <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                            setFiltroNombre("");
                            setFiltroCliente("");
                            setFiltroTipo("");
                        }}
                    >
                        Limpiar filtros
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
