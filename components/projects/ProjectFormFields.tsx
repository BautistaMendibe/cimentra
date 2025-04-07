"use client";

import { ChevronsUpDown, Check, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import Localidad from "@/models/Localidad";
import Provincia from "@/models/Provincia";
import { TypeProject } from "@/models/TypeProject";

interface Props {
  form: UseFormReturn<any>;
  provincias: Provincia[];
  localidades: Localidad[];
  projectTypes: TypeProject[];
}

export default function ProjectFormFields({ form, provincias, localidades, projectTypes }: Props) {
  const provinciaSeleccionada = provincias.find(
    (p) => p.nombre === form.watch("provincia")
  );

  return (
    <>
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
                  <SelectItem key={type.id} value={String(type.id)}>
                    <div className="flex items-center gap-2">
                      {type.icono && <span className="text-lg">{type.icono}</span>}
                      {type.nombre}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Categoría que mejor describe este proyecto.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Ubicación</FormLabel>
      </div>
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
                      className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
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
                              form.setValue("provincia", val);
                              form.setValue("localidad", "");
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
                      className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
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
                            onSelect={(val) => form.setValue("localidad", val)}
                          >
                            {loc.nombre}
                            <Check
                              className={cn(
                                "ml-auto",
                                loc.nombre === field.value ? "opacity-100" : "opacity-0"
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

      <div className="flex flex-col md:flex-row gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Fecha de Inicio</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Seleccioná una fecha"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Fecha de Finalización</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Seleccioná una fecha"}
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
      </div>

      <FormField
        control={form.control}
        name="activo"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>¿Proyecto Activo?</FormLabel>
              <FormDescription>
                Podés activar o pausar el proyecto desde acá.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}