"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Proyecto } from "@/models/Project";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProyecto() {
      setLoading(true);
      const { data, error } = await supabase
        .from("proyecto_detalle_view")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error al obtener proyecto:", error);
        setError(true);
        setLoading(false);
        return;
      }

      setProyecto(data as Proyecto);
      setLoading(false);
    }

    fetchProyecto();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">No se pudo cargar el proyecto.</p>
        <Button onClick={() => router.back()} className="mt-4">
          ← Volver
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-4">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-1">
          <div>
            <span
              className={`text-xs px-2 py-1 rounded-full w-fit ${
                proyecto.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {proyecto.activo ? "Proyecto activo" : "Proyecto inactivo"}
            </span>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mt-2">{proyecto.nombre}</CardTitle>
            <CardDescription>Detalle completo del proyecto</CardDescription>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        {/* Grupo: Tipo y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md bg-gray-50 p-4 border">
            <p className="text-muted-foreground text-xs mb-1">Tipo de proyecto</p>
            <p className="font-medium flex items-center gap-1">
              <span>{proyecto.icono_tipo}</span>
              {proyecto.tipo}
            </p>
          </div>

          <div className="rounded-md bg-gray-50 p-4 border">
            <p className="text-muted-foreground text-xs mb-1">Estado</p>
            <span className={`px-2 py-0.5 rounded-full text-xs ${proyecto.color_estado}`}>
              {proyecto.estado}
            </span>
          </div>
        </div>

        {/* Grupo: Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md bg-gray-50 p-4 border">
            <p className="text-muted-foreground text-xs mb-1">Fecha de inicio</p>
            <p>{formatearFecha(proyecto.fecha_inicio)}</p>
          </div>

          <div className="rounded-md bg-gray-50 p-4 border">
            <p className="text-muted-foreground text-xs mb-1">Fecha de finalización</p>
            <p>{proyecto.fecha_fin ? formatearFecha(proyecto.fecha_fin) : "-"}</p>
          </div>
        </div>

        {/* Grupo: Ubicación */}
        <div className="rounded-md bg-gray-50 p-4 border">
          <p className="text-muted-foreground text-xs mb-1">Ubicación</p>
          <p>{`${proyecto.calle}, ${proyecto.localidad}, ${proyecto.provincia}`}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatearFecha(fecha: string) {
  const f = new Date(fecha);
  return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
}
