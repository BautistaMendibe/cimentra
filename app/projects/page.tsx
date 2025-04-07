"use client";

import { useEffect, useState } from "react";
import { Proyecto } from "@/models/Project";
import ProjectsClient from "@/components/projects/ProjectClient";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function ProjectsPage() {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects();
    }, []);

    async function getProjects() {
        const supabase = createClient();
        setLoading(true);

        const { data, error } = await supabase
            .from("proyecto")
            .select(`
        *,
        provincias(nombre),
        localidades(nombre),
        tipos_proyecto(nombre, icono),
        estados_proyecto(nombre, color)
    `)
            .order("id", { ascending: false });


        if (error) {
            toast.error("Error al cargar los proyectos.");
            setLoading(false);
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
              color_estado: p.estados_proyecto?.color,
            })) as Proyecto[]
          );

        setLoading(false);
    }

    return (
        <>
            <ProjectsClient proyectos={proyectos} />
            <Toaster richColors position="top-center" />
        </>
    );
}