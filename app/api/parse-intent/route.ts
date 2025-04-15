// app/api/parse-intent/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { mensaje } = await req.json()

  // Simulación dummy - esto lo vamos a mejorar con IA después
  const dummyResponse = {
    intencion: 'crear_proyecto',
    nombre: 'Edificio Libertador',
    localidad: 'Córdoba',
    cliente: 'Arq. Gómez',
    fecha_inicio: '2025-04-14',
    fecha_fin: '2025-06-30',
    mensaje_original: mensaje
  }

  return NextResponse.json(dummyResponse)
}
