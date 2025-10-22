import axios from "axios";
import { jsPDF } from "jspdf";

// Extend jsPDF to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}
import autoTable from "jspdf-autotable";
import { AppRoutes } from "../../constants/AppRoutes";
import { toast } from "react-toastify";

export const handlePdfSave = (
  formData,
  buttonType,
  status,
  setwhatsappLoading
) => {
  const doc = new jsPDF();
  const safeText = (val) => String(val ?? "");
  const shipmentStatus = status || "Ship?ment in Godown";

  const formatDate = (dateStr) => {
    const [y, m, d] = (dateStr || "").split("-");
    return d && m && y ? `${d}/${m}/${y}` : "";
  };

  // ==== HEADER ====
  
  const companyLines = doc.splitTextToSize("Pak Chinar Int'I Cargo", 90);

  doc.setFontSize(15);
  doc.setFont("helvetica", "normal");
  const addressLines = doc.splitTextToSize(
    "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
    80
  );
  const companyNumber = doc.splitTextToSize("+966591080611 | +966590878234 | +966590056199",
    90
  );

  const companyY = 15;
  const addressY = companyY + companyLines.length * 8;
  const numberY = addressY + companyY + companyLines.length * 6;
  const footerY = addressY + addressLines.length * 6;
  const rightColumnBottom = footerY + 18;

  const invoiceInfoY = 28;
  const leftColumnBottom = invoiceInfoY + 24;

  const headerHeight = Math.max(50, rightColumnBottom, leftColumnBottom);

  doc.setFillColor(33, 91, 168);
  doc.rect(0, 0, 210, headerHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 15, companyY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.text(`Invoice #: ${safeText(formData.InvoiceNo)}`, 15, companyY + 8);
  doc.text(
    `Booking Date: ${formatDate(formData.BookingDate)}`,
    15,
    companyY + 14
  );
  doc.text(`Tracking Id: ${safeText(formData.BiltyNo)}`, 15, companyY + 20);
  doc.text(`City: ${formData.City}`, 15, companyY + 26);
  doc.text(`Branch: ${formData.Branch}`, 15, companyY + 32);
  doc.text(`Total Weight: ${formData.totalWeight} KG`, 15, companyY + 38);

  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  companyLines.forEach((line, i) => doc.text(line, 120, companyY + i * 6));
  doc.setFontSize(12);
  addressLines.forEach((line, i) => doc.text(line, 120, addressY + i * 6));
  companyNumber.forEach((line, i) => doc.text(line, 120, numberY + i * 6));

  // doc.text("City", 120, footerY);
  // doc.text("Saudi Arabia", 120, footerY + 6);
  // doc.text("75311", 120, footerY + 12);

  // ==== BODY START ====
  const bodyStartY = headerHeight + 10;

  // Sender and Receiver
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SENDER DETAILS:", 15, bodyStartY);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const senderLines = [
    `Name:       ${safeText(formData.SenderName)}`,
    `ID:             ${safeText(formData.SenderIdNumber)}`,
    `Mobile:      ${safeText(formData.SenderMobile)}`,
    `Address:    ${safeText(formData.SenderAddress)}`,
    `City:           ${safeText(formData.SenderArea)}`,
  ];
  // let currentY = bodyStartY + 5;

  // senderLines.forEach((line) => {
  //   const wrappedText = doc.splitTextToSize(line, 80); // 80 = max width
  //   doc.text(wrappedText, 15, currentY);
  //   currentY += wrappedText.length * 5; // move Y based on how many lines wrapped
  // });

  let currentY = bodyStartY + 7;

  senderLines.forEach((line) => {
    const wrappedText = doc.splitTextToSize(line, 80); // wrap line to array

    if (line.startsWith("Address:")) {
      // First line x = 15
      doc.text(wrappedText[0], 15, currentY);
      currentY += 5;

      // Remaining lines x = 30
      for (let i = 1; i < wrappedText.length; i++) {
        doc.text(wrappedText[i], 37, currentY);
        currentY += 5;
      }
    } else {
      // For all other lines
      doc.text(wrappedText, 15, currentY);
      // currentY += wrappedText.length * 4.5;
      currentY += wrappedText.length * 6;
    }
  });
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  // doc.text("RECEIVER DETAILS:", 130, bodyStartY);
  doc.text("RECEIVER DETAILS:", 120, bodyStartY);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const receiverLines = [
    `Name:         ${safeText(formData.ReceiverName)}`,
    `Mobile 1:    ${safeText(formData.ReceiverMobile1)}`,
    `Mobile 2:    ${safeText(formData.ReceiverMobile2)}`,
    `Address:     ${safeText(formData.ReceiverAddress)}`,
    `City:            ${safeText(formData.ReceiverArea)}`,
  ];
  // let currentRY = bodyStartY + 5;
  let currentRY = bodyStartY + 7;

  receiverLines.forEach((line) => {
    const wrappedText = doc.splitTextToSize(line, 80); // wrap line to array

    if (line.startsWith("Address:")) {
      // First line x = 15
      doc.text(wrappedText[0], 120, currentRY);
      currentRY += 5;

      // Remaining lines x = 30
      for (let i = 1; i < wrappedText.length; i++) {
        doc.text(wrappedText[i], 143, currentRY);
        currentRY += 5;
      }
    } else {
      // For all other lines
      doc.text(wrappedText, 120, currentRY);
      currentRY += wrappedText.length * 6;
    }
  });

  // const detailStartY = bodyStartY + Math.max(senderLines.length, receiverLines.length) * 6 + 10;
  const detailStartY =
    bodyStartY + Math.max(senderLines.length, receiverLines.length) * 5 + 20;
  // const detailStartY = bodyStartY +  receiverLines.length * 5 + 20;

  // --- Column Positions ---
  // === Column Positions ===
  const col1X = 20; // Pieces
  const col2X = 65; // Item Details
  const col3X = 130; // Other Details
  const maxWidth = 55; // text wrap width per column
  const lineHeight = 4; // reduced gap
  let y = detailStartY;

  // === TABLE HEADER ===
  const headerHeight1 = 7; // header ki height (adjustable)
  doc.setFillColor(200, 255, 200); // Light blue background
  doc.rect(15, y - 5, 185, headerHeight1, "F");
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Pieces", col1X, y);
  doc.text("Item Details", col2X, y);
  doc.text("Other Details", col3X, y);

  // Thin line under header (optional)
  doc.setFillColor(215, 234, 249);
  doc.setLineWidth(0.2);
  doc.line(15, y + 1.5, 200, y + 1.5);

  y += 6; // small space below header

  // === TABLE BODY ===

  // Column 1 — Pieces
  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.text(safeText(formData.NoOfPieces), col1X+5, y+5);

  // Column 2 — Item Details (wrapped)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const itemLines = doc.splitTextToSize(
    safeText(formData.ItemDetails),
    maxWidth
  );
  doc.text(itemLines, col2X, y+2);

  // Column 3 — Other Details (wrapped)
  const otherLines = doc.splitTextToSize(
    safeText(formData.OtherDetails),
    maxWidth
  );
  doc.text(otherLines, col3X, y+2);

  // === Calculate height for next section ===
  const bodyHeight =
    Math.max(itemLines.length, otherLines.length) * lineHeight + 4;
  const tableEndY = y + bodyHeight;

  // Optional bottom line for table
  //doc.setLineWidth(0.1);
  //doc.line(15, tableEndY, 200, tableEndY);

  // --- Calculate dynamic next Y position for next section ---
  const rowHeight =
    Math.max(itemLines.length, otherLines.length) * lineHeight + 8;
  const tableStartY = y + rowHeight;
  // ========== CHARGES TABLE ==========
  // autoTable(doc, {
  //   head: [["#", "CHARGES", "UNIT/RATE", "QUANTITY", "SAR TOTAL"]],
  //   body: Object.entries(formData.Charges || {}).map(([key, value], index) => [
  //     index + 1,
  //     safeText(key),
  //     `${safeText(value.unitRate)}`,
  //     value.qty > 0 ? `${value.qty}` : "",
  //     value.qty > 0 ? `${safeText(value.total)}` : "",
  //   ]),
  //   startY: tableStartY,
  //   theme: "grid",

  //   // âœ… Center align body columns
  //   columnStyles: {
  //     0: { halign: 'center' },
  //     1: { halign: 'left' },
  //     2: { halign: 'center' },
  //     3: { halign: 'center' },
  //     4: { halign: 'center' },
  //   },

  //   // âœ… Center align header text
  //   headStyles: {
  //     halign: 'center',
  //   }
  // });
 
  autoTable(doc, {
    head: [["#", "CHARGES", "UNIT/RATE", "QUANTITY", "SAR TOTAL"]],

    body: Object.entries(formData.Charges || {}).map(([key, value], index) => {
      const charge = value as { unitRate: string; qty: number; total: string };
      return [
        index + 1,
        safeText(key),
        `${safeText(charge.unitRate)}`,
        charge.qty > 0 ? `${charge.qty}` : "",
        charge.qty > 0 ? `${safeText(charge.total)}` : "",
      ];
    }),
    startY: tableStartY,
    margin: { top: 2, bottom: 2 },
    styles: {
      cellPadding: 1.2,
      fontSize: 12, // smaller font
    },
    theme: "grid",

    // âœ… Center align body columns
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "left" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },

    // âœ… Center align header text
    headStyles: {
      halign: "center",
    },
  });

  const finalY = doc.lastAutoTable?.finalY+15 || tableStartY ;

  const notesBoxX = 0;
  const notesBoxWidth = 120;
  const notesY = finalY ;
  // const boxHeight = 30;
  const boxHeight = 21;

  // Draw Notes Box
  doc.setFillColor(215, 234, 249);
  doc.rect(notesBoxX, notesY, notesBoxWidth, boxHeight, "F");

  // Set styles
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Text content
  const notesTitle = "Amount In Words:";
  const thankYouMsg = formData.AmountInWords;
  const wrappedText = doc.splitTextToSize(thankYouMsg, notesBoxWidth - 20); // padding 10 on both sides
  // const lineHeight = 6;
  // const lineHeight = 5;
  const textHeight = wrappedText.length * lineHeight;

  // Center content vertically in box
  const verticalStart = notesY + (boxHeight - textHeight - lineHeight) ;

  // Render bold title
  doc.setFont(undefined, "bold");
  doc.text(notesTitle, notesBoxX + 10, verticalStart);

  // Render normal wrapped lines
  doc.setFont(undefined, "normal");
  wrappedText.forEach((line, i) => {
    doc.text(line, notesBoxX + 10, verticalStart + lineHeight * (i +1.5));
  });

  // ========== TOTALS ==========
  const summaryItems = [
    { label: "SUBTOTAL", value: `SAR ${safeText(formData.SubTotal)}` },
    { label: "VAT", value: `SAR ${safeText(formData.VatTotal)}` },
    { label: "TOTAL", value: `SAR ${safeText(formData.InvoiceTotal)}` },
  ];

  summaryItems.forEach((item, i) => {
    // const y = finalY + 10 + i * 10;
    const y = finalY  + i * 7.1;
    doc.setFillColor(215, 234, 249);
    // doc.setFillColor(33, 91, 168);
    doc.setTextColor(0, 0, 0);
    doc.rect(120, y, 90, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, 125, y + 5);
    doc.setFontSize(14);
    doc.text(item.value, 205, y + 5, { align: "right" });
  });

  // Footer Box (Head Office & Branches)
  function drawFooterBlock(title, address, phone, startX, startY) {
    doc.setFontSize(10);

    // Title
    doc.setFont("helvetica", "bold");
    doc.text(title, startX, startY);
    let currentY = startY + 5;

    // Address
    doc.setFont("helvetica", "normal");
    const addressLabel = "Address:";
    const addressText = safeText(address);
    const addressLabelWidth = doc.getTextWidth(addressLabel + " ");

    const addressLines = doc.splitTextToSize(
      addressText,
      210 - startX - addressLabelWidth - 5
    );

    // First address line (label + first line)
    doc.text(addressLabel, startX, currentY);
    doc.text(addressLines[0], startX + addressLabelWidth, currentY);
    currentY += 5;

    // Remaining address lines
    for (let i = 1; i < addressLines.length; i++) {
      doc.text(addressLines[i], startX + addressLabelWidth, currentY);
      currentY += 5;
    }

    // Phone
    const phoneLabel = "Phone:";
    const phoneText = safeText(phone);
    const phoneLabelWidth = doc.getTextWidth(phoneLabel + " ");

    const phoneLines = doc.splitTextToSize(
      phoneText,
      210 - startX - phoneLabelWidth - 5
    );

    // First phone line (label + first line)
    doc.text(phoneLabel, startX, currentY);
    doc.text(phoneLines[0], startX + phoneLabelWidth, currentY);
    currentY += 5;

    // Remaining phone lines
    for (let i = 1; i < phoneLines.length; i++) {
      doc.text(phoneLines[i], startX + phoneLabelWidth, currentY);
      currentY += 5;
    }

    return currentY + 3; // spacing before next block
  }

  // let footerStartY = finalY + 10 + summaryItems.length * 10 + 3; // start after totals

  // // // Optional: adjust page height if footer exceeds page
  // const pageHeight = doc.internal.pageSize.height;
  // if (footerStartY + 40 > pageHeight) {
  //   doc.addPage(); // Add new page if needed
  //   footerStartY = 20; // reset Y for new page
  //   }
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerReservedHeight = 50;
  let footerStartY = pageHeight - footerReservedHeight;

  // Optional: draw background if you want the footer to stand out
  doc.setFillColor(33, 91, 168);
  doc.rect(0, footerStartY - 5, 210, 60, "F"); // 60 is approx footer height

  // Now render footer blocks
  let footerYY = footerStartY;

  footerYY = drawFooterBlock(
    "Dammam Head Office:",
    "Dammam Al-Khaleej, Street 22, Double Road Opposite Boys School Near Al-Ahli Bank ATM",
    "+966591080611 | +966590878234 | +966590056199",
    10,
    footerYY
  );

  footerYY = drawFooterBlock(
    "Al-Thuqbah Office:",
    "Al-Thuqbah, Rabigh Street 18, Opposite Fish Market, Near Gr",
    "+966580129991 | +966553441378 | +966591080611",
    10,
    footerYY
  );

  footerYY = drawFooterBlock(
    "AL HASSA(-HOFUF) Office:",
    "Al-Hofuf Opposite General Court, Al Koot Al Naathil Mosque",
    "+966599039931 | +966539328832 | +966591080611",
    10,
    footerYY
  );

  // ========== AMOUNT IN WORDS ==========
  // const totalsY = finalY + 10;
  //   const amountHeading = "Amount in Words:";
  //   const amountText = safeText(formData.AmountInWords);
  //   const amountLines = doc.splitTextToSize(amountText, 210);
  //   const amountHeight = 6 + amountLines.length * 6 + 6;

  //   let amountWordsY = totalsY + summaryItems.length * 10 + 7;

  //   if (amountWordsY + amountHeight > doc.internal.pageSize.getHeight()) {
  //     doc.addPage();
  //     amountWordsY = 5;
  //   }

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(12);
  //   doc.setTextColor(0, 0, 0);
  //   doc.text(amountHeading, 15, amountWordsY);

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(11);
  //   amountLines.forEach((line, i) => {
  //     doc.text(line, 15, amountWordsY + 6 + i * 6);
  //   });
  const fileName = `booking_${safeText(formData.BiltyNo || "record")}`;

  if (buttonType === "SavePDF") {
    doc.save(`${fileName}.pdf`);
  } else if (buttonType === "Save&PRINT") {
    const blob = doc.output("blob");
    const blobURL = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobURL;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      URL.revokeObjectURL(blobURL);
    };
  } else if (buttonType === "SendToWhatsapp") {
    const blob = doc.output("blob");
    const file = new File([blob], `${fileName}.pdf`, {
      type: "application/pdf",
    });
    // console.log(file);

    return file;
  }
};
