// server/api/taxi.js
import { form4231 } from '../library/form4231.js';
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const data = req.body;
            console.log(data);
            const pdfBytes = await form4231(data);
            console.log(pdfBytes);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=taxi.pdf',
            });
            res.send(Buffer.from(pdfBytes));
            
        } catch (error) {
            res.status(500).send(error.message);
        }
  }
}