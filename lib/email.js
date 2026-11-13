// Sends an email notification for every new contact/quote-form submission
// via Gmail SMTP (app password). Credentials live in .env.local / Vercel env:
//   GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFY_EMAILS (comma-separated)
import nodemailer from "nodemailer";

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendLeadNotification(msg) {
  const transporter = getTransport();
  const to = (process.env.NOTIFY_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
  if (!transporter || !to.length) return false;

  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = [
    ["Name", msg.name],
    ["Phone", msg.phone],
    ["Email", msg.email],
    ["Service", msg.service],
    ["City / Area", msg.city],
  ].filter(([, v]) => v);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="background:#0a2540;color:#fff;padding:14px 18px;border-radius:10px 10px 0 0;margin:0">
        New Quote Request — ${esc(msg.service) || "Website"}
      </h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #dbe7f1">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:10px 14px;font-weight:bold;background:#f2f7fb;border-bottom:1px solid #dbe7f1;width:130px">${k}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #dbe7f1">${esc(v)}</td>
          </tr>`).join("")}
      </table>
      ${msg.message ? `<div style="margin-top:14px;padding:12px 14px;background:#f7fafd;border:1px solid #dbe7f1;border-radius:8px;white-space:pre-wrap">${esc(msg.message)}</div>` : ""}
      <p style="color:#4a5b6c;font-size:12px;margin-top:14px">Sent from the Cleannit website contact form.</p>
    </div>`;

  await transporter.sendMail({
    from: `"Cleannit Website" <${process.env.GMAIL_USER}>`,
    to,
    subject: `New quote request: ${msg.service || "General"} — ${msg.name}`,
    text: [
      `Name: ${msg.name}`,
      `Phone: ${msg.phone}`,
      msg.email ? `Email: ${msg.email}` : "",
      msg.service ? `Service: ${msg.service}` : "",
      msg.city ? `City: ${msg.city}` : "",
      msg.message ? `\n${msg.message}` : "",
    ].filter(Boolean).join("\n"),
    html,
  });
  return true;
}
