import nodemailer from 'nodemailer';

/**
 * Email Service — Automated PDF Ticket Dispatch
 * 
 * Uses Gmail SMTP with App Password authentication.
 * Gracefully skips if EMAIL_USER / EMAIL_PASS are not configured.
 */

const isEmailConfigured = (): boolean => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

interface TicketEmailData {
  recipientEmail: string;
  recipientName: string;
  pnr: string;
  origin: string;
  destination: string;
  departureTime: Date;
  seatNumbers: string[];
  totalAmount: number;
  operatorName: string;
  busType: string;
}

/**
 * Sends a branded HTML booking confirmation email with the PDF ticket attached.
 * This function is designed to be called in fire-and-forget mode —
 * it never throws; all errors are logged silently.
 */
export const sendTicketEmail = async (
  emailData: TicketEmailData,
  pdfBuffer: Buffer
): Promise<void> => {
  // Graceful skip if email is not configured
  if (!isEmailConfigured()) {
    console.log('[Email] Skipped — EMAIL_USER / EMAIL_PASS not configured in environment');
    return;
  }

  try {
    const transporter = createTransporter();

    const departureDate = new Date(emailData.departureTime);
    const formattedDate = departureDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = departureDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">🚌 VeloxBus</h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Booking Confirmed — Your E-Ticket is Ready!</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 12px;">
              <p style="margin:0;font-size:16px;color:#1e293b;">Hi <strong>${emailData.recipientName}</strong>,</p>
              <p style="margin:8px 0 0;font-size:14px;color:#475569;line-height:1.6;">
                Your bus ticket has been confirmed successfully! Your PNR number is 
                <strong style="color:#dc2626;font-size:16px;letter-spacing:1px;">${emailData.pnr}</strong>.
              </p>
            </td>
          </tr>

          <!-- Journey Card -->
          <tr>
            <td style="padding:8px 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40%;vertical-align:top;">
                          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">From</p>
                          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#0f172a;">${emailData.origin}</p>
                        </td>
                        <td style="width:20%;text-align:center;vertical-align:middle;">
                          <span style="font-size:22px;color:#dc2626;">→</span>
                        </td>
                        <td style="width:40%;vertical-align:top;text-align:right;">
                          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">To</p>
                          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#0f172a;">${emailData.destination}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px dashed #cbd5e1;padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:50%;">
                          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;">Date & Time</p>
                          <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#1e293b;">${formattedDate}</p>
                          <p style="margin:2px 0 0;font-size:13px;color:#475569;">${formattedTime}</p>
                        </td>
                        <td style="width:50%;text-align:right;">
                          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;">Seats</p>
                          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#0f172a;">${emailData.seatNumbers.join(', ')}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px dashed #cbd5e1;padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:50%;">
                          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;">Operator</p>
                          <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#1e293b;">${emailData.operatorName}</p>
                          <p style="margin:2px 0 0;font-size:12px;color:#64748b;">${emailData.busType}</p>
                        </td>
                        <td style="width:50%;text-align:right;">
                          <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;">Total Paid</p>
                          <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#16a34a;">₹${emailData.totalAmount.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1e293b;">📋 Important Instructions:</p>
              <ul style="margin:0;padding-left:18px;font-size:12px;color:#475569;line-height:1.8;">
                <li>Please carry a valid Photo ID during the journey.</li>
                <li>Report at the boarding point <strong>15 minutes before departure</strong>.</li>
                <li>Your PDF E-Ticket with QR boarding pass is attached below.</li>
                <li>This ticket is non-transferable.</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">
                This is an automated confirmation from VeloxBus. Please do not reply to this email.<br>
                © ${new Date().getFullYear()} VeloxBus — India's Trusted Bus Booking Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const mailOptions = {
      from: `"VeloxBus Tickets" <${process.env.EMAIL_USER}>`,
      to: emailData.recipientEmail,
      subject: `✅ Booking Confirmed — ${emailData.origin} → ${emailData.destination} | PNR: ${emailData.pnr}`,
      html: htmlBody,
      attachments: [
        {
          filename: `Ticket-${emailData.pnr}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] ✅ Ticket emailed to ${emailData.recipientEmail} for PNR ${emailData.pnr}`);
  } catch (error: any) {
    // Non-fatal: log and continue — booking is already confirmed
    console.error(`[Email] ❌ Failed to send ticket email for PNR ${emailData.pnr}:`, error.message);
  }
};
