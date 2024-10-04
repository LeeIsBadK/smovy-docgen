// src/routes/api/taxi.ts

import { json } from '@sveltejs/kit';
import { form4231 } from '../../../../library/form4231.js';

import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    const pdfBytes = await form4231(data);

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="taxi_receipt.pdf"'
      }
    });
  } catch (error) {
    return json({ error: 'Error generating PDF' }, { status: 500 });
  }
}
