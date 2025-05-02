import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { mensaje, created_by } = await req.json();

  if (!mensaje || !created_by) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }

  try {
    // GPT: parsear mensaje
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente que extrae datos para creación de proyectos de construcción. 
            Devuelve un JSON con posibles claves: {"nombre": "", "localidad": "", "cliente": "", "fecha_inicio": "", "fecha_fin": ""}.
            No todas son obligatorias. Si no se menciona alguna, simplemente omítela.
            Fechas en formato ISO (YYYY-MM-DD), asume abril 2025 como contexto. No expliques nada, responde solo el JSON.`,
        },
        {
          role: 'user',
          content: `Mensaje: "${mensaje}"`,
        },
      ],
      temperature: 0.1,
    });

    const raw = completion.choices[0].message.content ?? '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Fechas (opcionales)
    const fecha_inicio = parsed.fecha_inicio ? new Date(parsed.fecha_inicio) : null;
    let fecha_fin = parsed.fecha_fin ? new Date(parsed.fecha_fin) : null;

    if (fecha_inicio && fecha_fin && fecha_fin <= fecha_inicio) {
      fecha_fin.setFullYear(fecha_fin.getFullYear() + 1);
    }

    // Cliente (opcional)
    let clienteId = null;
    if (parsed.cliente) {
      const { data: clientes } = await supabaseAdmin
        .from('cliente')
        .select('id, nombre, apellido');

      const clienteMatch = clientes?.find(c =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(parsed.cliente.toLowerCase())
      );

      clienteId = clienteMatch?.id ?? null;
    }

    // Localidad y provincia (opcional)
    let localidadId = null;
    let provinciaId = null;

    if (parsed.localidad) {
      const { data: localidades } = await supabaseAdmin
        .from('localidades')
        .select('id, nombre, id_provincia');

      const localidadMatch = localidades?.find(l =>
        l.nombre.toLowerCase().includes(parsed.localidad.toLowerCase())
      );

      if (localidadMatch) {
        localidadId = localidadMatch.id;
        provinciaId = localidadMatch.id_provincia;
      }
    }

    // Insertar proyecto (con campos opcionales)
    const { error: insertError, data: proyecto } = await supabaseAdmin
      .from('proyecto')
      .insert([
        {
          nombre: parsed.nombre ?? 'Proyecto sin nombre',
          fecha_inicio: fecha_inicio ?? null,
          fecha_fin: fecha_fin ?? null,
          id_cliente: clienteId,
          id_localidad: localidadId,
          id_provincia: provinciaId,
          calle: '',
          id_tipo: null,
          id_presupuesto: null,
          activo: true,
          created_by,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error al insertar:', insertError);
      return NextResponse.json({ error: 'No se pudo crear el proyecto' }, { status: 500 });
    }

    return NextResponse.json({
      mensaje: 'Proyecto creado con éxito (campos opcionales)',
      proyecto,
    });

  } catch (err) {
    console.error('Error grave:', err);
    return NextResponse.json({ error: 'Error al procesar el mensaje' }, { status: 500 });
  }
}
