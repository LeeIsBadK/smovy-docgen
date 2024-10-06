import { j as json } from "../../../../chunks/index.js";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
const isProd = process.env.NODE_ENV === "production";
const fontPath = isProd ? path.join(process.cwd(), "public", "fonts", "THSarabunNew", "THSarabunNew.ttf") : path.join(process.cwd(), "static", "fonts", "THSarabunNew", "THSarabunNew.ttf");
const pdfPath = isProd ? path.join(process.cwd(), "public", "documents", "form4231.pdf") : path.join(process.cwd(), "static", "documents", "form4231.pdf");
const thaiNumbers = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const thaiUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
function convertToThaiText(number) {
  const parts = number.split(".");
  const bahtPart = parts[0];
  const satangPart = parts[1];
  let bahtText = convertWholePart(bahtPart);
  let satangText = convertWholePart(satangPart);
  if (satangPart === "00") {
    return bahtText + "บาทถ้วน";
  } else {
    return bahtText + "บาท" + satangText + "สตางค์";
  }
}
function convertWholePart(numberStr) {
  let text = "";
  const len = numberStr.length;
  for (let i = 0; i < len; i++) {
    const digit = parseInt(numberStr[i]);
    const unitIndex = len - i - 1;
    if (digit !== 0) {
      if (unitIndex === 1 && digit === 1) {
        text += "สิบ";
      } else if (unitIndex === 1 && digit === 2) {
        text += "ยี่สิบ";
      } else if (unitIndex !== 1 && digit === 1 && i === len - 1) {
        text += "เอ็ด";
      } else {
        text += thaiNumbers[digit];
        text += thaiUnits[unitIndex];
      }
    } else if (unitIndex === 6) {
      text += thaiUnits[unitIndex];
    }
  }
  return text;
}
async function form4231(data) {
  try {
    console.log(data);
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(fontPath);
    const thSarabunFont = await pdfDoc.embedFont(fontBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const date = /* @__PURE__ */ new Date();
    const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
    firstPage.drawText("คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย", {
      x: 255,
      y: height - 118,
      size: 16,
      font: thSarabunFont,
      color: rgb(0, 0, 0)
    });
    firstPage.drawText(dateString, {
      x: 90,
      y: height - 166,
      size: 16,
      font: thSarabunFont,
      color: rgb(0, 0, 0)
    });
    const textTaxi = "ค่ารถแท็กซี่หมายเลขทะเบียน " + (data.taxi_plate || " ") + " " + (data.province || " ") + " จาก " + (data.from || " ") + " ถึง " + (data.to || " ");
    const maxWidth = 220;
    const words = textTaxi.split(" ");
    let line = "";
    let yPosition = height - 166;
    const lineHeight = 21.5;
    const pageMargin = 50;
    const minY = 150;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = thSarabunFont.widthOfTextAtSize(testLine, 16);
      if (testWidth > maxWidth && line !== "") {
        firstPage.drawText(line.trim(), {
          x: 175,
          // Adjust X based on the table layout
          y: yPosition,
          size: 16,
          font: thSarabunFont,
          color: rgb(0, 0, 0)
        });
        line = words[i] + " ";
        yPosition -= lineHeight;
        if (yPosition < minY) {
          yPosition = height - 100;
        }
      } else {
        line = testLine;
      }
    }
    if (line !== "") {
      firstPage.drawText(line.trim(), {
        x: 175,
        y: yPosition,
        size: 16,
        font: thSarabunFont,
        color: rgb(0, 0, 0)
      });
    }
    const amount = parseFloat(data.amount).toFixed(2);
    firstPage.drawText(amount, {
      x: 410,
      y: height - 166,
      size: 16,
      font: thSarabunFont,
      color: rgb(0, 0, 0)
    });
    const amountText = convertToThaiText(amount);
    firstPage.drawText(amountText, {
      x: 250,
      y: height - 635,
      size: 16,
      font: thSarabunFont,
      color: rgb(0, 0, 0)
    });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}
async function POST({ request }) {
  try {
    const data = await request.json();
    const pdfBytes = await form4231(data);
    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="taxi_receipt.pdf"'
      }
    });
  } catch (error) {
    return json({ error: "Error generating PDF" }, { status: 500 });
  }
}
export {
  POST
};
