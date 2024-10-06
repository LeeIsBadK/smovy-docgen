import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from 'fontkit';

// Define the data type
interface TaxiData {
    taxi_plate: string;
    province: string;
    from: string;
    to: string;
    amount: string;
}

// Helper function to load font and PDF from the file system
async function loadFontAndPdf(): Promise<{ font: Buffer, pdf: Buffer }> {
    try {
        // Construct paths to the font and PDF files
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'THSarabunNew','THSarabunNew.ttf');
        const pdfPath = path.join(process.cwd(), 'public', 'documents', 'form4231.pdf');

        // Load files using fs.promises
        const fontBuffer = await fs.readFile(fontPath);
        const pdfBuffer = await fs.readFile(pdfPath);

        return { font: fontBuffer, pdf: pdfBuffer };
    } catch (error) {
        console.error('Error loading font or PDF file:', error);
        throw new Error('File loading error');
    }
}

const thaiNumbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

// Convert number to Thai text
function convertToThaiText(number: string): string {
    const parts = number.split('.'); // Ensure two decimal places
    const bahtPart = parts[0];
    const satangPart = parts[1];

    const bahtText = convertWholePart(bahtPart);
    const satangText = convertWholePart(satangPart);

    if (satangPart === '00') {
        return bahtText + 'บาทถ้วน';
    } else {
        return bahtText + 'บาท' + satangText + 'สตางค์';
    }
}

function convertWholePart(numberStr: string): string {
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

// Function to process the form 4231 PDF
async function form4231(data: TaxiData): Promise<Uint8Array> {
    try {
        const { font, pdf } = await loadFontAndPdf();

        // Load the existing PDF
        const pdfDoc = await PDFDocument.load(pdf);

        // Register fontkit
        // @ts-ignore
        pdfDoc.registerFontkit(fontkit);

        // Embed the custom font
        const thSarabunFont = await pdfDoc.embedFont(font);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // Draw static text
        firstPage.drawText('คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย', {
            x: 255,
            y: height - 118,
            size: 16,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
        });

        const date = new Date();
        const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;

        firstPage.drawText(dateString, {
            x: 90,
            y: height - 166,
            size: 16,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
        });

        // Taxi details
        const textTaxi = `ค่ารถแท็กซี่หมายเลขทะเบียน ${data.taxi_plate || ' '} ${data.province || ' '} จาก ${data.from || ' '} ถึง ${data.to || ' '}`;
        const maxWidth = 220;
        const words = textTaxi.split(' ');
        let line = '';
        let yPosition = height - 166;
        const lineHeight = 21.5;
        const minY = 150;

        // Draw the text with wrapping
        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = thSarabunFont.widthOfTextAtSize(testLine, 16);

            if (testWidth > maxWidth && line !== '') {
                firstPage.drawText(line.trim(), {
                    x: 175,
                    y: yPosition,
                    size: 16,
                    font: thSarabunFont,
                    color: rgb(0, 0, 0),
                });
                line = word + ' ';
                yPosition -= lineHeight;

                if (yPosition < minY) {
                    yPosition = height - 100;
                }
            } else {
                line = testLine;
            }
        }

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
