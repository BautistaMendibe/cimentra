import { NextRequest } from 'next/server';

async function parseFormData(req: NextRequest): Promise<Record<string, string>> {
  const text = await req.text();
  return Object.fromEntries(new URLSearchParams(text));
}

export async function POST(req: NextRequest) {
  const data = await parseFormData(req);

  const mensaje = data.Body;
  const numero = data.From; // Ej: whatsapp:+5493511234567
  const created_by = `bot-${numero.replace('whatsapp:', '')}`;

  if (!mensaje || !numero) {
    return new Response('Missing parameters', { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/proyecto-from-mensaje`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje, created_by }),
    });

    const result = await res.json();

    let respuesta = '⚠️ Hubo un error al crear el proyecto.';

    if (res.ok && result?.proyecto) {
      respuesta = `✅ Proyecto "${result.proyecto.nombre}" creado correctamente.`;
    }

    // Twilio espera respuesta en formato XML
    return new Response(`<Response><Message>${respuesta}</Message></Response>`, {
      headers: { 'Content-Type': 'application/xml' },
    });

  } catch (err) {
    console.error('Error en /via-bot:', err);
    return new Response('<Response><Message>Error interno del servidor</Message></Response>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
