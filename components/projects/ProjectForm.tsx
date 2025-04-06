"use client"

import { use, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TypeProject } from "@/models/TypeProject"
import Provincia from "@/models/Provincia";
import Localidad from "@/models/Localidad"


const formSchema = z.object({
    name: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    type: z.string({
        required_error: "Seleccioná un tipo de proyecto.",
    }),
    provincia: z.string().min(2, {
        message: "La ubicación es obligatoria.",
    }),
    localidad: z.string().min(2, {
        message: "La ubicación es obligatoria.",
    }),
    calle: z.string().min(2, {
        message: "La ubicación es obligatoria.",
    }),
    startDate: z.date({
        required_error: "Elegí la fecha de inicio.",
    }),
    endDate: z.date().nullable(),
    activo: z.boolean(),
})

export default function ProjectForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [projectTypes, setProjectTypes] = useState<TypeProject[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);

    useEffect(() => {
        getTypesProjects();
        getProvincias()
    }, []);

    async function getTypesProjects() {
        const { data, error } = await supabase.from("tipos_proyecto").select("*");

        if (error) {
            console.error("Error fetching project types:", error);
            toast.error("Error al cargar los tipos de proyecto.");
            return;
        }

        const tipos: TypeProject[] = data.map((item: TypeProject) => ({
            id: item.id,
            nombre: item.nombre,
        }));

        setProjectTypes(tipos);
    }

    async function getProvincias() {
        const { data, error } = await supabase.from("provincias").select("*");

        if (error) {
            console.error("Error fetching provincias:", error);
            toast.error("Error las provincias.");
            return;
        }

        const provincias: Provincia[] = data.map((item: Provincia) => ({
            id: item.id,
            nombre: item.nombre,
            localidades: []
        }));

        setProvincias(provincias);
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
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

      useEffect(() => {
        async function fetchLocalidades() {
            if (!provinciaSeleccionada) {
                setLocalidades([]);
                return;
            }

            const { data, error } = await supabase
                .from("localidades")
                .select("*")
                .eq("id_provincia", provinciaSeleccionada.id);

            if (error) {
                console.error("Error al cargar localidades:", error);
                toast.error("Error al obtener localidades.");
                return;
            }

            setLocalidades(data);
        }

        fetchLocalidades();
    }, [provinciaSeleccionada]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        const proyectoConFechaCreacion = {
            ...values,
            fecha_creacion: new Date(),
            id_presupuesto: null, // temporal
        }

        setTimeout(() => {
            console.log("Proyecto creado:", proyectoConFechaCreacion);
            toast.success("Proyecto creado", {
                description: `${values.name} fue creado correctamente.`,
            });
            form.reset()
            setIsSubmitting(false)
        }, 1000)
    }

    return (
        <Card className="max-w-9xl">
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle className={"text-3xl font-bold"}>Crear Proyecto</CardTitle>
                    <CardDescription>Completá los campos para registrar un nuevo proyecto.</CardDescription>
                </div>
                <div className="mt-3">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        ← Volver
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Nombre */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Proyecto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Edificio Belgrano" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tipo */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Proyecto</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccioná un tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {projectTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Selecciona la categoría que mejor describe este proyecto.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ubicación */}
                        <div className="mt-4">
                        <FormLabel>Ubicación</FormLabel>
                        </div>
                        <div className="flex flex-row gap-4">
                        {/* Provincia */}
                        <FormField
                            control={form.control}
                            name="provincia"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? provincias.find((provincia) => provincia.nombre === field.value)?.nombre
                                                        : "Seleccionar provincia"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar provincia..." />
                                                <CommandList>
                                                    <CommandEmpty>Ninguna provincia encontrada.</CommandEmpty>
                                                    <CommandGroup>
                                                        {provincias.map((provincia) => (
                                                            <CommandItem
                                                                value={provincia.nombre}
                                                                key={provincia.id}
                                                                onSelect={(currentValue) => {
                                                                    form.setValue("provincia", currentValue);
                                                                    form.setValue("localidad", ""); // Resetea la localidad si cambia la provincia
                                                                }}
                                                            >
                                                                {provincia.nombre}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        provincia.nombre === field.value ? "opacity-100" : "opacity-0"
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


                        {/* Localidad */}
                        <FormField
                            control={form.control}
                            name="localidad"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={!provinciaSeleccionada}
                                                >
                                                    {field.value
                                                        ? localidades.find((loc) => loc.nombre === field.value)?.nombre
                                                        : "Seleccionar localidad"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar localidad..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontraron localidades.</CommandEmpty>
                                                    <CommandGroup>
                                                        {localidades.map((localidad) => (
                                                            <CommandItem
                                                                value={localidad.nombre}
                                                                key={localidad.id}
                                                                onSelect={(currentValue) => {
                                                                    form.setValue("localidad", currentValue);
                                                                }}
                                                            >
                                                                {localidad.nombre}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        localidad.nombre === field.value ? "opacity-100" : "opacity-0"
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


                        {/* Calle */}

                        </div>                        


                        {/* Fecha inicio */}
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Inicio</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Seleccioná una fecha</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Fecha fin */}
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Finalización</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Seleccioná una fecha</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ?? undefined}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Activo */}
                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>¿Proyecto Activo?</FormLabel>
                                        <FormDescription>Podés activar o pausar el proyecto desde acá.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Botón */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creando..." : "Crear Proyecto"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => form.reset()}>
                    Reiniciar formulario
                </Button>
            </CardFooter>
        </Card>
    )
}
