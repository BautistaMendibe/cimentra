import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Cliente from "@/models/Cliente"

type Props = {
  cliente: Cliente
  onClose: () => void
}

export default function ClienteSidePanel({ cliente, onClose }: Props) {
  const form = useForm({
    defaultValues: {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email ?? "",
      telefono: cliente.telefono ?? "",
      direccion: cliente.direccion ?? "",
    },
  })

  return (
    <div className="fixed right-0 top-[75px] h-screen w-[90vw] sm:w-[40vw] bg-white border-l shadow-md z-10 overflow-y-auto transition-all">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Cliente</h2>
        <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
      </div>

      <Tabs defaultValue="datos" className="p-4">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="datos">Datos</TabsTrigger>
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <Input {...form.register("nombre")} />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <Input {...form.register("apellido")} />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input {...form.register("email")} />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <Input {...form.register("telefono")} />
          </div>

          <div>
            <label className="block text-sm mb-1">Dirección</label>
            <Textarea {...form.register("direccion")} />
          </div>

          <Button className="mt-2 w-full">Guardar cambios</Button>
        </TabsContent>

        <TabsContent value="proyectos">
          <p className="text-sm text-muted-foreground">Acá irán los proyectos asociados</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
