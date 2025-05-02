import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const { mensaje } = await req.json();

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: [
                {
                    role: 'system',
                    content: `Eres un asistente que extrae datos para creación de proyectos de construcción. 
                    Devuelve exclusivamente un JSON con las siguientes claves: {"nombre": "", "localidad": "", "cliente": "", "fecha_inicio": "", "fecha_fin": ""}.
                    Instrucciones:
                    - "fecha_inicio" y "fecha_fin" deben estar en formato ISO (YYYY-MM-DD).
                    - Asume siempre que estamos en abril de 2025.
                    - Si se menciona un día ("lunes", "martes", etc.), convierte al día más cercano en el futuro a partir de abril de 2025.
                    - Si se menciona solo un mes ("junio", "septiembre"), usa el primer día de ese mes en 2025.
                    - Si la fecha de fin resulta anterior a la fecha de inicio, ajusta la fecha de fin al año siguiente (2026).
                    No expliques nada, responde solo el JSON.`,
                },
                {
                    role: 'user',
                    content: `Mensaje: "${mensaje}"`,
                },
            ],
            temperature: 0.1,
        });

        const respuestaGPT = completion.choices[0].message.content;
        console.log('Respuesta cruda de GPT:', respuestaGPT);

        const cleanedContent = respuestaGPT?.replace(/```json|```/g, '').trim() ?? '{}';
        const dataParsed = JSON.parse(cleanedContent);

        const fechaInicio = new Date(dataParsed.fecha_inicio);
        let fechaFin = new Date(dataParsed.fecha_fin);

        if (fechaFin <= fechaInicio) {
            fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        }

        return NextResponse.json({
            ...dataParsed,
            fecha_inicio: fechaInicio.toISOString().split('T')[0],
            fecha_fin: fechaFin.toISOString().split('T')[0],
            mensaje_original: mensaje,
        });

    } catch (error) {
        console.error('Error real:', error);
        return NextResponse.json({ error: 'Error procesando el mensaje' }, { status: 500 });
    }
}
