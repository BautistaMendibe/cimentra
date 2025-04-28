"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import Provincia from "@/models/Provincia";
import Localidad from "@/models/Localidad";
import { TypeProject } from "@/models/TypeProject";
import ProjectFormFields from "./ProjectFormFields";
import Cliente from "@/models/Cliente";
import { it } from "node:test";
import ClienteSidePanel from "../clients/ClienteSidePanel";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  type: z.string({
    required_error: "Seleccioná un tipo de proyecto.",
  }),
  id_cliente: z.string({
    required_error: "Seleccioná un tipo de proyecto.",
  }),
  provincia: z.string().min(2, {
    message: "La provincia es obligatoria.",
  }),
  localidad: z.string().min(2, {
    message: "La localidad es obligatoria.",
  }),
  calle: z.string().min(2, {
    message: "La calle es obligatoria.",
  }),
  startDate: z.date({
    required_error: "Elegí la fecha de inicio.",
  }),
  endDate: z.date().nullable(),
  activo: z.boolean(),
});

export default function ProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [projectTypes, setProjectTypes] = useState<TypeProject[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarPanelCliente, setMostrarPanelCliente] = useState(false);
  const [clienteActual, setClienteActual] = useState<Cliente>({} as Cliente);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      id_cliente: "",
      provincia: "",
      localidad: "",
      calle: "",
      startDate: new Date(),
      endDate: null,
      activo: true,
    },
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
    getTypesProjects();
    getProvincias();
    getClientes();
  }, []);

  useEffect(() => {
    if (provinciaSeleccionada) {
      fetchLocalidades(provinciaSeleccionada.id);
    }
  }, [provinciaSeleccionada]);

  async function getTypesProjects() {
    const { data, error } = await supabase.from("tipos_proyecto").select("*");
    if (!error && data) {
      const tipos: TypeProject[] = data.map((item: TypeProject) => ({
        id: item.id,
        nombre: item.nombre,
        icono: item.icono,
      }));
      setProjectTypes(tipos);
    } else {
      toast.error("Error al cargar los tipos de proyecto.");
    }
  }

  async function getProvincias() {
    const { data, error } = await supabase.from("provincias").select("*");
    if (!error && data) {
      const provincias: Provincia[] = data.map((item: Provincia) => ({
        id: String(item.id),
        nombre: item.nombre,
        localidades: [],
      }));
      setProvincias(provincias);
    } else {
      toast.error("Error al cargar las provincias.");
    }
  }

  async function fetchLocalidades(idProvincia: string) {
    const { data, error } = await supabase
      .from("localidades")
      .select("*")
      .eq("id_provincia", idProvincia);

    if (!error && data) {
      const locs: Localidad[] = data.map((item: any) => ({
        id: String(item.id),
        idProvincia: String(item.id_provincia),
        nombre: item.nombre,
      }));
      setLocalidades(locs);
    }
  }

  async function getClientes() {
    const { data, error } = await supabase.from("cliente").select("*");
    if (!error && data) {
      const clients: Cliente[] = data.map((item: Cliente) => ({
        id: item.id,
        nombre: item.nombre,
        apellido: item.apellido,
        email: item.email,
        telefono: item.telefono,
        provincia: item.provincia,
        localidad: item.localidad,
        id_provincia: item.id_provincia,
        calle: item.calle,
        id_localidad: item.id_localidad,
        direccion: item.direccion,
      }));
      setClientes(clients);
    } else {
      toast.error("Error al cargar los clientes.");
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("proyecto").insert([
      {
        nombre: values.name,
        fecha_inicio: values.startDate,
        fecha_fin: values.endDate,
        id_tipo: values.type,
        id_presupuesto: null,
        activo: values.activo,
        created_by: user?.id,
        id_provincia: Number(provinciaSeleccionada?.id),
        id_localidad: Number(localidadSeleccionada?.id),
        calle: values.calle,
        id_cliente: values.id_cliente,
      },
    ]);

    if (error) {
      toast.error("Hubo un error al crear el proyecto.");
      setIsSubmitting(false);
    } else {
      toast.success("Proyecto creado", {
        description: `${values.name} fue creado correctamente.`,
      });
      form.reset();
      setIsSubmitting(false);
      router.push("/projects");
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-2">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-3xl font-bold sm:w-auto">🚧 Crear Proyecto</CardTitle>
          <CardDescription>
            Completá los campos para registrar un nuevo proyecto.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProjectFormFields
              form={form}
              provincias={provincias}
              localidades={localidades}
              projectTypes={projectTypes}
              clientes={clientes}
              onNuevoCliente={() => {
                setClienteActual({} as Cliente); // cliente vacío
                setMostrarPanelCliente(true);
              }}
            />

            {mostrarPanelCliente && (
              <ClienteSidePanel
                cliente={clienteActual}
                mostrarTabProyectos={false}
                onClose={() => setMostrarPanelCliente(false)}
                onCloseAndSearch={() => {
                  setMostrarPanelCliente(false);
                  getClientes(); 
                }}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Proyecto"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6 flex-col sm:flex-row gap-4 sm:gap-0">
        <Button variant="outline" onClick={() => form.reset()}>
          Reiniciar formulario
        </Button>
      </CardFooter>
    </Card>
  );
}
