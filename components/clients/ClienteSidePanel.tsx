"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"
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

type Props = {
  cliente: Cliente
  onClose: () => void;
  onCloseAndSearch: () => void;
}

export default function ClienteSidePanel({ cliente, onClose, onCloseAndSearch }: Props) {
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])

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
    getProvincias()
  }, [])

  useEffect(() => {
    if (provinciaSeleccionada) {
      fetchLocalidades(provinciaSeleccionada.id)
    }
  }, [provinciaSeleccionada])

  async function getProvincias() {
    const { data, error } = await supabase.from("provincias").select("*")
    if (!error && data) {
      const provincias: Provincia[] = data.map((item: Provincia) => ({
        id: String(item.id),
        nombre: item.nombre,
        localidades: []
      }))
      setProvincias(provincias)
    } else {
      toast.error("Error al cargar las provincias.")
    }
  }

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
      <div className="fixed right-0 top-[75px] h-[calc(100vh-75px)] w-[100vw] sm:w-[40vw] bg-white border-l shadow-md z-10 flex flex-col">
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
              <TabsTrigger value="proyectos">Proyectos vinculados</TabsTrigger>
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
              <p className="text-sm text-muted-foreground">
                Acá irán los proyectos asociados
              </p>
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
