"use client"

import { useForm, FormProvider } from "react-hook-form"
import { use, useEffect, useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Cliente from "@/models/Cliente"
import Provincia from "@/models/Provincia"
import Localidad from "@/models/Localidad"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { Popover, PopoverContent } from "../ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../ui/command"
import { cn } from "@/lib/utils"
import { Proyecto } from "@/models/Project"
import router from "next/router"

type Props = {
  cliente: Cliente,
  mostrarTabProyectos: boolean,
  onClose: () => void;
  onCloseAndSearch: () => void;
}

export default function ClienteSidePanel({ cliente, onClose, onCloseAndSearch, mostrarTabProyectos }: Props) {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadCliente, setLocalidadToForm] = useState<Localidad>();
  const [provinciaCliente, setProvinciaToForm] = useState<Provincia>();
  const [proyectosVinculados, setProyectosVinculados] = useState<Proyecto[]>([]);


  const form = useForm({
    defaultValues: {
      nombre: cliente.nombre ?? "",
      apellido: cliente.apellido ?? "",
      email: cliente.email ?? "",
      telefono: cliente.telefono ?? "",
      provincia: cliente.provincia ?? "",
      localidad: cliente.localidad ?? "",
      calle: cliente.calle ?? ""
    }
  })

  const provinciaSeleccionada = useMemo(() => {
    const nombreProvincia = form.watch("provincia")
    return provincias.find((p) => p.nombre === nombreProvincia)
  }, [form.watch("provincia"), provincias])

  const localidadSeleccionada = useMemo(() => {
    const nombreLocalidad = form.watch("localidad")
    return localidades.find((l) => l.nombre === nombreLocalidad)
  }, [form.watch("localidad"), localidades])

  useEffect(() => {
    if (provinciaSeleccionada) {
      fetchLocalidades(provinciaSeleccionada.id)
    }
  }, [provinciaSeleccionada])

  useEffect(() => {
    const fetchProvincias = async () => {
      const { data, error } = await supabase.from("provincias").select("*")

      if (!error && data) {
        const provincias: Provincia[] = data.map((item: Provincia) => ({
          id: String(item.id),
          nombre: item.nombre,
          localidades: [],
        }))
        setProvincias(provincias);

        if (cliente.id_provincia) {
          const provinciaCliente = provincias.find(p => p.id === String(cliente.id_provincia));
          if (provinciaCliente) {
            form.setValue("provincia", provinciaCliente.nombre)
            fetchLocalidades(provinciaCliente.id)
          }
        }
      } else {
        toast.error("Error al cargar las provincias.")
      }
    }

    fetchProvincias();
  }, []);

  // Setear localidad una vez que localidades estén cargadas y cliente tenga valor
  useEffect(() => {
    if (cliente.id_localidad && localidades.length > 0) {
      const localidadCliente = localidades.find(l => l.id === String(cliente.id_localidad));
      if (localidadCliente) {
        form.setValue("localidad", localidadCliente.nombre)
      }
    }
  }, [localidades, cliente.id_localidad]);

  // Buscar proyectos vinculados al cliente
  useEffect(() => {
    const fetchProyectosVinculados = async () => {
      if (cliente.id) {
        const { data, error } = await supabase
          .from("proyecto_detalle_view")
          .select("*")
          .eq("id_cliente", cliente.id)

        if (!error && data) {
          setProyectosVinculados(data)
        } else {
          toast.error("Error al cargar los proyectos vinculados.")
        }
      }
    }

    fetchProyectosVinculados()
  }, [cliente.id]);

  async function fetchLocalidades(idProvincia: string) {
    const { data, error } = await supabase
      .from("localidades")
      .select("*")
      .eq("id_provincia", idProvincia)

    if (!error && data) {
      const locs: Localidad[] = data.map((item: any) => ({
        id: String(item.id),
        idProvincia: String(item.id_provincia),
        nombre: item.nombre
      }))
      setLocalidades(locs)
    }
  }

  useEffect(() => {
    if (cliente.id) {
      form.setValue("nombre", cliente.nombre)
      form.setValue("apellido", cliente.apellido)
      form.setValue("email", cliente.email)
      form.setValue("telefono", cliente.telefono)
      form.setValue("calle", cliente.calle)
    }
  }, [cliente])

  const onSubmit = async (values: any) => {
    const idProvincia = provincias.find(p => p.nombre === values.provincia)?.id
    const idLocalidad = localidades.find(l => l.nombre === values.localidad)?.id

    if (!idProvincia || !idLocalidad) {
      toast.error("Seleccioná una provincia y localidad válidas.")
      return
    }

    const payload = {
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      telefono: values.telefono,
      id_provincia: idProvincia,
      id_localidad: idLocalidad,
      calle: values.calle
    }

    if (cliente.id) {
      // Update
      const { error } = await supabase
        .from("cliente")
        .update(payload)
        .eq("id", cliente.id)

      if (error) {
        toast.error("Error al actualizar el cliente.")
      } else {
        toast.success("Cliente actualizado correctamente.")
        onCloseAndSearch()
      }
    } else {
      // Insert
      const { error } = await supabase
        .from("cliente")
        .insert(payload)

      if (error) {
        toast.error("Error al crear el cliente.")
      } else {
        toast.success("Cliente creado correctamente.")
        onCloseAndSearch()
      }
    }
  }


  return (
    <Form {...form}>
      <div className="fixed right-0 top-[70px] h-[calc(100vh-70px)] w-[100vw] sm:w-[40vw] bg-white border-l shadow-md z-10 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {cliente.nombre
              ? `Cliente ${cliente.nombre + " " + cliente.apellido}`
              : "Nuevo cliente"}
          </h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="datos" className="p-4">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="datos">Datos</TabsTrigger>
              {mostrarTabProyectos && (
                <TabsTrigger value="proyectos">Proyectos vinculados</TabsTrigger>
              )}

            </TabsList>

            <TabsContent value="datos" className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <br></br>
              <FormLabel>Ubicación</FormLabel>

              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="provincia"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[200px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value || "Seleccionar provincia"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar provincia..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron provincias.</CommandEmpty>
                              <CommandGroup>
                                {provincias.map((provincia) => (
                                  <CommandItem
                                    key={provincia.id}
                                    value={provincia.nombre}
                                    onSelect={(val) => {
                                      form.setValue("provincia", val)
                                      form.setValue("localidad", "")
                                    }}
                                  >
                                    {provincia.nombre}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        provincia.nombre === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localidad"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[200px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={!provinciaSeleccionada}
                            >
                              {field.value || "Seleccionar localidad"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar localidad..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron localidades.</CommandEmpty>
                              <CommandGroup>
                                {localidades.map((loc) => (
                                  <CommandItem
                                    key={loc.id}
                                    value={loc.nombre}
                                    onSelect={(val) =>
                                      form.setValue("localidad", val)
                                    }
                                  >
                                    {loc.nombre}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        loc.nombre === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Calle y número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="proyectos">

              {proyectosVinculados.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No hay proyectos vinculados.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {proyectosVinculados.map((proyecto) => (
                    <div
                      key={proyecto.id}
                      className="border rounded-md p-4 shadow-sm bg-white"
                    >
                      <div className="font-semibold text-lg mb-1">{proyecto.nombre}</div>
                      <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <span>{proyecto.icono_tipo}</span>
                        <span>{proyecto.tipo}</span>
                      </div>

                      <div className="text-sm mb-1">
                        <strong>Estado:</strong>{" "}
                        <EstadoProyectoTag estado={proyecto.estado} color={proyecto.color_estado} />
                      </div>
                      <div className="text-sm mb-1">
                        <strong>Inicio:</strong> {formatearFecha(proyecto.fecha_inicio)}
                      </div>
                      <div className="text-sm mb-1">
                        <strong>Fin:</strong>{" "}
                        {proyecto.fecha_fin ? formatearFecha(proyecto.fecha_fin) : "-"}
                      </div>
                      <div className="text-sm mb-1">
                        <strong>Cliente:</strong> {proyecto.cliente_nombre} {proyecto.cliente_apellido}
                      </div>
                      <div className="text-sm mb-1">
                        <strong>Ubicación:</strong> {proyecto.calle}, {proyecto.localidad}, {proyecto.provincia}
                      </div>
                      <div className="flex gap-4 justify-end">                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t">
          <Button className="w-full" onClick={form.handleSubmit(onSubmit)}>Guardar cambios</Button>
        </div>

      </div>
    </Form>
  )
}

function formatearFecha(fecha: string) {
  const f = new Date(fecha);
  return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
}

function EstadoProyectoTag({ estado, color }: { estado?: string; color?: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full bg-black text-white`}>
      {estado}
    </span>
  );
}