"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

const opciones = [
    "ID",
    "Nombre",
    "Cliente",
    "Fecha de Registro",
    "Estado",
    "Tipo",
    "Etiquetas",
    "Visitas",
];

export function AgruparPorDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    Agrupar por
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {opciones.map((op) => (
                    <DropdownMenuItem key={op} onClick={() => console.log(`Agrupar por ${op}`)}>
                        {op}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
