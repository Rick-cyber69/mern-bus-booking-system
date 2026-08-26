import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generatePDFTicket = (bookingData: any, qrDataUrl: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header Banner
      doc
        .rect(0, 0, doc.page.width, 100)
        .fill('#0f172a');
      
      doc
        .fillColor('#ffffff')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('BUS BOOKING E-TICKET', 40, 35);
      
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`PNR NUMBER: ${bookingData.pnr}`, doc.page.width - 220, 42, { align: 'right' });

      // Main Ticket Content
      doc.fillColor('#1e293b').fontSize(14).font('Helvetica-Bold').text('JOURNEY DETAILS', 40, 120);
      doc.moveTo(40, 138).lineTo(doc.page.width - 40, 138).strokeColor('#cbd5e1').stroke();

      doc.fontSize(11).font('Helvetica-Bold').text('Route:', 40, 150);
      doc.font('Helvetica').text(`${bookingData.origin} → ${bookingData.destination}`, 120, 150);

      doc.font('Helvetica-Bold').text('Operator:', 40, 170);
      doc.font('Helvetica').text(bookingData.operatorName || 'Express Bus Lines', 120, 170);

      doc.font('Helvetica-Bold').text('Bus Type:', 40, 190);
      doc.font('Helvetica').text(bookingData.busType, 120, 190);

      doc.font('Helvetica-Bold').text('Departure:', 40, 210);
      doc.font('Helvetica').text(new Date(bookingData.departureTime).toLocaleString(), 120, 210);

      // Seats & Total
      doc.font('Helvetica-Bold').text('Seats Booked:', 320, 150);
      doc.font('Helvetica').text(bookingData.seatNumbers.join(', '), 420, 150);

      doc.font('Helvetica-Bold').text('Total Paid:', 320, 170);
      doc.font('Helvetica').text(`$${bookingData.totalAmount.toFixed(2)}`, 420, 170);

      doc.font('Helvetica-Bold').text('Status:', 320, 190);
      doc.font('Helvetica').text(bookingData.bookingStatus, 420, 190);

      // Passenger Table
      doc.fontSize(14).font('Helvetica-Bold').text('PASSENGER DETAILS', 40, 250);
      doc.moveTo(40, 268).lineTo(doc.page.width - 40, 268).strokeColor('#cbd5e1').stroke();

      let yPos = 280;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Seat', 40, yPos);
      doc.text('Passenger Name', 120, yPos);
      doc.text('Age', 320, yPos);
      doc.text('Gender', 420, yPos);

      doc.moveTo(40, yPos + 15).lineTo(doc.page.width - 40, yPos + 15).strokeColor('#e2e8f0').stroke();
      yPos += 25;

      doc.font('Helvetica');
      for (const p of bookingData.passengers) {
        doc.text(p.seatNumber, 40, yPos);
        doc.text(p.name, 120, yPos);
        doc.text(String(p.age), 320, yPos);
        doc.text(p.gender, 420, yPos);
        yPos += 20;
      }

      // QR Code Image insertion
      if (qrDataUrl) {
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrBuffer = Buffer.from(base64Data, 'base64');
        doc.image(qrBuffer, doc.page.width - 160, 360, { width: 120, height: 120 });
        doc.fontSize(8).fillColor('#64748b').text('Scan QR to verify ticket', doc.page.width - 165, 485, { align: 'center', width: 130 });
      }

      // Important Instructions
      doc.fontSize(10).fillColor('#1e293b').font('Helvetica-Bold').text('Important Instructions:', 40, 380);
      doc.fontSize(9).font('Helvetica').fillColor('#475569');
      doc.text('1. Please carry a valid Photo ID during the journey.', 40, 400);
      doc.text('2. Report at the boarding point 15 minutes before departure time.', 40, 415);
      doc.text('3. This ticket is non-transferable.', 40, 430);

      // Footer
      doc
        .rect(0, doc.page.height - 40, doc.page.width, 40)
        .fill('#f1f5f9');
      doc
        .fillColor('#64748b')
        .fontSize(9)
        .text('Self-Hosted Bus Booking System | Powered by MERN Stack', 40, doc.page.height - 25, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
