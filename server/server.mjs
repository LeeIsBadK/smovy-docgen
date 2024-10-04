import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { form4231 } from './library/form4231.js';
const { createRequire } = await import('module');
const require = createRequire(import.meta.url);
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Check if PUBLIC_WEB is correctly loaded from .env
console.log("CORS allowed for:", process.env.PUBLIC_WEB);

// Enable CORS with dynamic origin from environment variables
app.use(cors({
    origin: process.env.PUBLIC_WEB, // allow requests from your Svelte app
    credentials: true // if you are using credentials like cookies
}));

// Define a POST endpoint
app.post('/api/taxi', async (req, res) => {
    try {
        const data = req.body;
        const pdfBytes = await form4231(data);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=taxi_receipt-12.pdf',
        });
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});