import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const company = String(body.company ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const toAddress = 'support@braneiq.com';

  const transporter = getTransporter();

  if (!transporter) {
    console.error('[contact] SMTP not configured — SMTP_HOST, SMTP_USER, SMTP_PASS env vars missing.');
    console.log('[contact] Would have sent to:', toAddress, { name, email, company, message });
    return NextResponse.json({ ok: true });
  }

  const htmlBody = `
    <h2>New Demo Request — BraneIQ</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="color:#64748b;width:120px"><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td style="color:#64748b"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
      ${company ? `<tr><td style="color:#64748b"><strong>Company</strong></td><td>${company}</td></tr>` : ''}
      ${message ? `<tr><td style="color:#64748b;vertical-align:top"><strong>Message</strong></td><td style="white-space:pre-wrap">${message}</td></tr>` : ''}
    </table>
    <hr style="margin-top:24px;border:none;border-top:1px solid #e2e8f0" />
    <p style="font-size:12px;color:#94a3b8">Submitted via braneiq.com request-demo form</p>
  `;

  const textBody = [
    'New Demo Request — BraneIQ',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : '',
    message ? `Message:\n${message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await transporter.sendMail({
      from: `"BraneIQ Website" <${process.env.SMTP_USER}>`,
      replyTo: `"${name}" <${email}>`,
      to: toAddress,
      subject: `Demo Request from ${name}${company ? ` (${company})` : ''}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
