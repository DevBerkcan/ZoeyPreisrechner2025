import jsPDF from "jspdf";

interface PDFData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  gender: string;
  selectedAreas: { name: string; price: number }[];
  subtotal: number;
  discountPercent: number;
  total: number;
  date: Date;
}

export async function generateQuotePDF(data: PDFData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors (RGB)
  const mainColor: [number, number, number] = [5, 150, 105]; // #059669
  const textColor: [number, number, number] = [51, 51, 51];

  let yPos = 20;

  // Header - Company Name
  doc.setFontSize(24);
  doc.setTextColor(...mainColor);
  doc.text("NAZAR", 20, yPos);
  doc.setFontSize(10);
  doc.text("Beauty & Wellness", 20, yPos + 6);

  // Date - right aligned
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text(
    `Datum: ${data.date.toLocaleDateString("de-DE")}`,
    pageWidth - 20,
    yPos,
    { align: "right" }
  );

  yPos += 25;

  // Title
  doc.setFontSize(18);
  doc.setTextColor(...mainColor);
  doc.text("Kostenvoranschlag", 20, yPos);

  yPos += 15;

  // Customer Info
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.text(`Kunde: ${data.customerName}`, 20, yPos);
  yPos += 6;
  doc.text(`Geschlecht: ${data.gender}`, 20, yPos);
  if (data.customerEmail) {
    yPos += 6;
    doc.text(`E-Mail: ${data.customerEmail}`, 20, yPos);
  }
  if (data.customerPhone) {
    yPos += 6;
    doc.text(`Telefon: ${data.customerPhone}`, 20, yPos);
  }

  yPos += 15;

  // Treatments Table Header
  doc.setFillColor(...mainColor);
  doc.rect(20, yPos, pageWidth - 40, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Behandlung", 25, yPos + 5.5);
  doc.text("Preis", pageWidth - 25, yPos + 5.5, { align: "right" });

  yPos += 12;

  // Treatment rows
  doc.setTextColor(...textColor);
  data.selectedAreas.forEach((area, index) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    const bgColor = index % 2 === 0 ? 245 : 255;
    doc.setFillColor(bgColor, bgColor, bgColor);
    doc.rect(20, yPos - 4, pageWidth - 40, 8, "F");

    doc.text(area.name, 25, yPos + 1);
    doc.text(`${area.price.toFixed(2)} EUR`, pageWidth - 25, yPos + 1, {
      align: "right",
    });
    yPos += 8;
  });

  yPos += 10;

  // Totals
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  doc.text("Zwischensumme:", 100, yPos);
  doc.text(`${data.subtotal.toFixed(2)} EUR`, pageWidth - 25, yPos, {
    align: "right",
  });

  if (data.discountPercent > 0) {
    yPos += 7;
    doc.setTextColor(220, 53, 69);
    doc.text(`Rabatt (${data.discountPercent}%):`, 100, yPos);
    doc.text(
      `-${((data.subtotal * data.discountPercent) / 100).toFixed(2)} EUR`,
      pageWidth - 25,
      yPos,
      { align: "right" }
    );
  }

  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(...mainColor);
  doc.text("Gesamtbetrag:", 100, yPos);
  doc.text(`${data.total.toFixed(2)} EUR`, pageWidth - 25, yPos, {
    align: "right",
  });

  yPos += 20;

  // Financing Options
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.text("Finanzierungsoptionen:", 20, yPos);
  yPos += 7;
  doc.setFontSize(9);
  doc.text(`6 Monate: ${(data.total / 6).toFixed(2)} EUR/Monat`, 25, yPos);
  yPos += 5;
  doc.text(`12 Monate: ${(data.total / 12).toFixed(2)} EUR/Monat`, 25, yPos);
  yPos += 5;
  doc.text(`24 Monate: ${(data.total / 24).toFixed(2)} EUR/Monat`, 25, yPos);

  // Footer
  yPos = 280;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "Dieses Angebot ist unverbindlich. Gueltigkeitsdauer: 30 Tage.",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );

  return doc.output("blob");
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
