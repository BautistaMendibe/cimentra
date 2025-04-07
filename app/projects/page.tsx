"use client";

import { useEffect, useState } from "react";
import { Proyecto } from "@/models/Project";
import ProjectsClient from "@/components/projects/ProjectClient";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function ProjectsPage() {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);

    useEffect(() => {
        getProjects();
    }, []);

    async function getProjects() {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("proyecto")
            .select(`
        *,
        provincias(nombre),
        localidades(nombre),
        tipos_proyecto(nombre, icono),
        estados_proyecto(nombre)
    `)
            .order("id", { ascending: false });


        if (error) {
            toast.error("Error al cargar los proyectos.");
            return;
        }

        setProyectos(
            data.map((p: any) => ({
              ...p,
              provincia: p.provincias?.nombre,
              localidad: p.localidades?.nombre,
              tipo: p.tipos_proyecto?.nombre,
              estado: p.estados_proyecto?.nombre,
              icono_tipo: p.tipos_proyecto?.icono,
            })) as Proyecto[]
          );
    }

    return (
        <>
            <ProjectsClient proyectos={proyectos} />
            <Toaster richColors position="top-center" />
        </>
    );
}