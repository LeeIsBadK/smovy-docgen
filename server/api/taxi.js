// server/api/taxi.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const data = req.body;
            const pdfBytes = await form4231(data);
    
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=taxi.pdf',
            });
            res.send(Buffer.from(pdfBytes));
            
        } catch (error) {
            res.status(500).send('Error generating PDF');
        }
  }
}