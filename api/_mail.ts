import nodemailer from 'nodemailer';

const required = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
};

const firstDefined = (...names: string[]) => {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getTransporter = () => {
  // Prefer Mailtrap-specific env vars when present, then fall back to generic SMTP.
  const host = firstDefined('MAILTRAP_SMTP_HOST', 'MAILTRAP_HOST', 'SMTP_HOST') || required('SMTP_HOST');
  const port = Number(firstDefined('MAILTRAP_SMTP_PORT', 'MAILTRAP_PORT', 'SMTP_PORT') || 587);
  const secure =
    (firstDefined('MAILTRAP_SMTP_SECURE', 'MAILTRAP_SECURE', 'SMTP_SECURE') || 'false').toLowerCase() ===
    'true';
  const user =
    firstDefined('MAILTRAP_SMTP_USER', 'MAILTRAP_USER', 'SMTP_USER') || required('SMTP_USER');
  const pass =
    firstDefined('MAILTRAP_SMTP_PASS', 'MAILTRAP_PASSWORD', 'MAILTRAP_TOKEN', 'SMTP_PASS') ||
    required('SMTP_PASS');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

export const sendInquiryEmail = async (input: {
  name: string;
  email: string;
  interest: string;
  message: string;
  createdAt: string;
}) => {
  const from = firstDefined('MAILTRAP_FROM', 'SMTP_FROM') || required('SMTP_FROM');
  const to = required('ADMIN_EMAIL');

  const text = [
    'A new AudioWerkhaus inquiry was submitted.',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Interest: ${input.interest}`,
    `Submitted: ${input.createdAt}`,
    '',
    'Message:',
    input.message,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-bottom: 16px;">New AudioWerkhaus inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Interest:</strong> ${escapeHtml(input.interest)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(input.createdAt)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `;

  await getTransporter().sendMail({
    from,
    to,
    replyTo: input.email,
    subject: `New AudioWerkhaus inquiry: ${input.interest}`,
    text,
    html,
  });
};
