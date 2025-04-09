"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface Cliente {
  id: string
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  direccion?: string
}

export function ClienteDrawerEditable({ cliente }: { cliente: Cliente }) {
  const [form, setForm] = useState({ ...cliente })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateCliente = async () => {
    // Acá conectás con Supabase
    const { id, ...data } = form
    const { error } = await supabase
      .from("cliente")
      .update(data)
      .eq("id", id)

    if (error) {
      console.error("Error actualizando cliente:", error)
      alert("Hubo un error")
    } else {
      alert("Cliente actualizado ✅")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="text-sm text-blue-600 underline hover:text-blue-800">
          Editar
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Editar Cliente</h2>

          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input name="nombre" value={form.nombre} onChange={handleChange} />

            <Label>Apellido</Label>
            <Input name="apellido" value={form.apellido} onChange={handleChange} />

            <Label>Email</Label>
            <Input name="email" value={form.email ?? ""} onChange={handleChange} />

            <Label>Teléfono</Label>
            <Input name="telefono" value={form.telefono ?? ""} onChange={handleChange} />

            <Label>Dirección</Label>
            <Textarea name="direccion" value={form.direccion ?? ""} onChange={handleChange} />
          </div>

          <Button className="mt-4 w-full" onClick={updateCliente}>
            Guardar cambios
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}