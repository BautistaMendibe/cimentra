"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { Proyecto } from "@/models/Project";
import Provincia from "@/models/Provincia";
import Localidad from "@/models/Localidad";
import { TypeProject } from "@/models/TypeProject";
import ProjectFormFields from "./ProjectFormFields"; // ⚠️ Reutilizá los campos que ya tenés
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const formSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    type: z.string(),
    provincia: z.string(),
    localidad: z.string(),
    calle: z.string(),
    startDate: z.date(),
    endDate: z.date().nullable(),
    activo: z.boolean(),
});

export default function EditProjectForm() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [projectTypes, setProjectTypes] = useState<TypeProject[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [initialValues, setInitialValues] = useState<z.infer<typeof formSchema> | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues || {},
    });

    const provinciaSeleccionada = useMemo(() => {
        const nombreProvincia = form.watch("provincia");
        return provincias.find((p) => p.nombre === nombreProvincia);
    }, [form.watch("provincia"), provincias]);

    const localidadSeleccionada = useMemo(() => {
        const nombreLocalidad = form.watch("localidad");
        return localidades.find((l) => l.nombre === nombreLocalidad);
    }, [form.watch("localidad"), localidades]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (provinciaSeleccionada) {
            fetchLocalidades(provinciaSeleccionada.id);
        }
    }, [provinciaSeleccionada]);

    async function fetchInitialData() {
        const [{ data: proyecto }, { data: tipos }, { data: provs }] = await Promise.all([
            supabase.from("proyecto_detalle_view").select("*").eq("id", id).single(),
            supabase.from("tipos_proyecto").select("*"),
            supabase.from("provincias").select("*"),
        ]);

        if (!proyecto || !tipos || !provs) {
            toast.error("Error al cargar datos del proyecto");
            return;
        }

        const initialData: z.infer<typeof formSchema> = {
            name: proyecto.nombre,
            type: proyecto.id_tipo.toString(),
            provincia: proyecto.provincia,
            localidad: proyecto.localidad,
            calle: proyecto.calle,
            startDate: new Date(proyecto.fecha_inicio),
            endDate: proyecto.fecha_fin ? new Date(proyecto.fecha_fin) : null,
            activo: proyecto.activo,
        };

        setProjectTypes(tipos);
        setProvincias(provs.map((p) => ({ id: String(p.id), nombre: p.nombre, localidades: [] })));
        setInitialValues(initialData);
        form.reset(initialData);
        setLoading(false);
    }

    async function fetchLocalidades(idProvincia: string) {
        const { data, error } = await supabase
            .from("localidades")
            .select("*")
            .eq("id_provincia", idProvincia);

        if (!error && data) {
            const locs: Localidad[] = data.map((item) => ({
                id: String(item.id),
                idProvincia: String(item.id_provincia),
                nombre: item.nombre,
            }));

            setLocalidades(locs);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { error } = await supabase
            .from("proyecto")
            .update({
                nombre: values.name,
                fecha_inicio: values.startDate,
                fecha_fin: values.endDate,
                id_tipo: values.type,
                activo: values.activo,
                id_provincia: Number(provinciaSeleccionada?.id),
                id_localidad: Number(localidadSeleccionada?.id),
                calle: values.calle,
            })
            .eq("id", id);

        if (error) {
            toast.error("Error al actualizar el proyecto.");
        } else {
            toast.success("Proyecto actualizado correctamente.");
            router.push("/projects");
        }
    }

    if (loading || !initialValues) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Cargando datos del proyecto...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">✏️ Editar proyecto</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <ProjectFormFields
                        form={form}
                        provincias={provincias}
                        localidades={localidades}
                        projectTypes={projectTypes}
                    />

                    <div className="flex gap-4 justify-between">
                        <Button type="submit">Guardar cambios</Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
