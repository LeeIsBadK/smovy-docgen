import fs from 'fs';
import path, { resolve } from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from 'fontkit';
const isProd = process.env.NODE_ENV === 'production';

// import pdf and font file
// @ts-ignore

import fetch from 'node-fetch';

async function loadFontAndPdf() {
    let fontBuffer, pdfBuffer;

    if (process.env.NODE_ENV === 'production') {
        // In production (Vercel), fetch the files using the production URL
        const baseUrl = `https://${process.env.VERCEL_URL}`;
        const fontUrl = `${baseUrl}/fonts/THSarabunNew/THSarabunNew.ttf`;
        const pdfUrl = `${baseUrl}/documents/form4231.pdf`;

        // Fetch the font and PDF files
        const fontResponse = await fetch(fontUrl);
        if (!fontResponse.ok) {
            throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
        }
        fontBuffer = await fontResponse.arrayBuffer();

        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
        }
        pdfBuffer = await pdfResponse.arrayBuffer();
    } else {
        // For local development, read the font and PDF from the filesystem
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'THSarabunNew' ,'THSarabunNew.ttf');
        const pdfPath = path.join(process.cwd(), 'public', 'documents', 'form4231.pdf');

        fontBuffer = await fs.promises.readFile(fontPath);
        pdfBuffer = await fs.promises.readFile(pdfPath);
    }
    return { font: fontBuffer, pdf: pdfBuffer };
}
// Resolve the path for the font file

// Update paths for Vercel (public folder)
const { font, pdf } = await loadFontAndPdf();

const thaiNumbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

// @ts-ignore
function convertToThaiText(number) {
    const parts = number.split('.'); // Ensure two decimal places
    const bahtPart = parts[0];
    const satangPart = parts[1];

    let bahtText = convertWholePart(bahtPart);
    let satangText = convertWholePart(satangPart);

    if (satangPart === '00') {
        return bahtText + 'บาทถ้วน';
    } else {
        return bahtText + 'บาท' + satangText + 'สตางค์';
    }
}

// @ts-ignore
function convertWholePart(numberStr) {
    let text = '';
    const len = numberStr.length;

    for (let i = 0; i < len; i++) {
        const digit = parseInt(numberStr[i]);
        const unitIndex = len - i - 1;

        if (digit !== 0) {
            if (unitIndex === 1 && digit === 1) {
                text += 'สิบ';
            } else if (unitIndex === 1 && digit === 2) {
                text += 'ยี่สิบ';
            } else if (unitIndex !== 1 && digit === 1 && i === len - 1) {
                text += 'เอ็ด';
            } else {
                text += thaiNumbers[digit];
                text += thaiUnits[unitIndex];
            }
        } else if (unitIndex === 6) { // Handle the case of 'ล้าน'
            text += thaiUnits[unitIndex];
        }
    }
    return text;
}


// Create a new PDF document
// @ts-ignore
async function form4231(data) {
    try {
        console.log(data);
        //print current path

        // Load the existing PDF
        const existingPdfBytes = pdf;

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Register fontkit
        // @ts-ignore
        pdfDoc.registerFontkit(fontkit);

        // Read the font file
        const fontBytes = font;

        // Embed the custom font
        const thSarabunFont = await pdfDoc.embedFont(fontBytes);

        // Get the first page of the PDF
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // @ts-ignore
        const { width, height } = firstPage.getSize();

        const date = new Date();
        const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;

        firstPage.drawText('คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย', {
            x: 255,
            y: height - 118,
            size: 16,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(dateString, {
            x: 90,
            y: height - 166,
            size: 16,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
        });

        const textTaxi = 'ค่ารถแท็กซี่หมายเลขทะเบียน ' +(data.taxi_plate || ' ' )+ ' ' +(data.province || ' ' )+ ' จาก ' +(data.from || ' ')+' ถึง ' +(data.to || ' ');
        const maxWidth = 220; // Check if this is the correct width for the table cell
        const words = textTaxi.split(' ');
        let line = '';
        let yPosition = height - 166;
        const lineHeight = 21.5; // Height between lines
        // @ts-ignore
        const pageMargin = 50; // Bottom margin before wrapping to next page
        const minY = 150; // Adjust based on your table's layout

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = thSarabunFont.widthOfTextAtSize(testLine, 16);

            if (testWidth > maxWidth && line !== '') {
                // Draw the line on the PDF
                firstPage.drawText(line.trim(), {
                    x: 175, // Adjust X based on the table layout
                    y: yPosition,
                    size: 16,
                    font: thSarabunFont,
                    color: rgb(0, 0, 0),
                });
                line = words[i] + ' ';
                yPosition -= lineHeight; // Move to the next line

                // Check if we need to move to the next page
                if (yPosition < minY) {
                    yPosition = height - 100; // Reset Y for the next row
                }
            } else {
                line = testLine;
            }
        }

        // Draw the last line
        if (line !== '') {
            firstPage.drawText(line.trim(), {
                x: 175,
                y: yPosition,
                size: 16,
                font: thSarabunFont,
                color: rgb(0, 0, 0),
            });
        }

        const amount = parseFloat(data.amount).toFixed(2);
        firstPage.drawText(amount, {
            x: 410,
            y: height - 166,
            size: 16,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
        });


        const amountText = convertToThaiText(amount);
        firstPage.drawText(amountText, {
            x: 250,
            y: height - 635,
            size: 16,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
        });



        // Serialize the PDF document to bytes (Uint8Array)
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
}

export { form4231 };