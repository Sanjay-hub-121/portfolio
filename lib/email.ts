import nodemailer from 'nodemailer'

interface ContactEmailPayload {
  name: string
  email: string
  subject: string
  message: string
}

// Escapes HTML special characters so user-submitted content can't inject
// markup/scripts into the rendered email (e.g. a "name" of `<img onerror=...>`).
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendContactNotification(data: ContactEmailPayload): Promise<boolean> {
  const transporter = createTransporter()

  // If SMTP not configured, skip silently (message already saved to DB)
  if (!transporter) {
    console.warn('📧 SMTP not configured — email notification skipped. Configure SMTP_* vars to enable.')
    return false
  }

  const toEmail = process.env.CONTACT_EMAIL ?? process.env.SMTP_USER ?? ''

  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeSubject = escapeHtml(data.subject)
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>')

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: `"${safeName}" <${data.email}>`,
      subject: `[Portfolio] ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: 'Inter', Arial, sans-serif; background: #0A0A0F; color: #F1F1F5; margin: 0; padding: 0; }
              .wrapper { max-width: 560px; margin: 40px auto; }
              .card { background: #1A1A2E; border: 1px solid #252540; border-radius: 16px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 28px 32px; }
              .header h1 { color: white; margin: 0; font-size: 20px; font-weight: 700; }
              .header p { color: rgba(255,255,255,0.75); margin: 4px 0 0; font-size: 14px; }
              .body { padding: 28px 32px; }
              .field { margin-bottom: 20px; }
              .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5E5E7A; margin-bottom: 6px; font-family: monospace; }
              .value { color: #F1F1F5; font-size: 15px; line-height: 1.5; }
              .message-box { background: #141420; border: 1px solid #252540; border-radius: 10px; padding: 16px; margin-top: 6px; }
              .reply-btn { display: inline-block; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin-top: 24px; }
              .footer { padding: 20px 32px; border-top: 1px solid #252540; font-size: 12px; color: #5E5E7A; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="card">
                <div class="header">
                  <h1>New Contact Message</h1>
                  <p>Someone reached out via your portfolio</p>
                </div>
                <div class="body">
                  <div class="field">
                    <div class="label">From</div>
                    <div class="value">${safeName}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email</div>
                    <div class="value">${safeEmail}</div>
                  </div>
                  <div class="field">
                    <div class="label">Subject</div>
                    <div class="value">${safeSubject}</div>
                  </div>
                  <div class="field">
                    <div class="label">Message</div>
                    <div class="message-box value">${safeMessage}</div>
                  </div>
                  <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="reply-btn">
                    Reply to ${safeName}
                  </a>
                </div>
                <div class="footer">
                  Sent from your portfolio contact form · sanjay.dev
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New contact message from your portfolio:

From: ${data.name} <${data.email}>
Subject: ${data.subject}

${data.message}

---
Reply to: ${data.email}
      `.trim(),
    })

    console.log(`✅ Contact email sent to ${toEmail}`)
    return true
  } catch (err) {
    console.error('❌ Failed to send contact email:', err)
    return false
  }
}

// Auto-reply to the sender
export async function sendAutoReply(data: ContactEmailPayload): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) return false

  const safeName = escapeHtml(data.name)
  const safeSubject = escapeHtml(data.subject)

  try {
    await transporter.sendMail({
      from: `"Sanjay" <${process.env.SMTP_USER}>`,
      to: `"${safeName}" <${data.email}>`,
      subject: `Re: ${data.subject} — Got your message!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: 'Inter', Arial, sans-serif; background: #0A0A0F; color: #F1F1F5; margin: 0; padding: 0; }
              .wrapper { max-width: 560px; margin: 40px auto; }
              .card { background: #1A1A2E; border: 1px solid #252540; border-radius: 16px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 28px 32px; }
              .header h1 { color: white; margin: 0; font-size: 20px; font-weight: 700; }
              .body { padding: 28px 32px; color: #9898B0; line-height: 1.7; font-size: 15px; }
              .body strong { color: #F1F1F5; }
              .footer { padding: 20px 32px; border-top: 1px solid #252540; font-size: 12px; color: #5E5E7A; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="card">
                <div class="header">
                  <h1>Thanks for reaching out! 👋</h1>
                </div>
                <div class="body">
                  <p>Hi <strong>${safeName}</strong>,</p>
                  <p>Thanks for getting in touch! I've received your message about <strong>"${safeSubject}"</strong> and will get back to you within <strong>24 hours</strong>.</p>
                  <p>In the meantime, feel free to check out my work at <strong>sanjay.dev</strong>.</p>
                  <p>Talk soon,<br/><strong>Sanjay</strong><br/>Full Stack Developer & UI/UX Designer</p>
                </div>
                <div class="footer">
                  This is an automated reply — please don't reply to this email directly.
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    return true
  } catch (err) {
    console.error('❌ Auto-reply failed:', err)
    return false
  }
}
