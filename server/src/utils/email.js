import { isEmailConfigured } from '../config/env.js'

/**
 * sendEmail — uses Brevo HTTP API (avoids SMTP port restrictions)
 * @param {{ to, subject, html, replyTo? }} options
 */
export async function sendEmail({ to, subject, html, replyTo }) {
  if (process.env.NODE_ENV === 'test') return

  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not configured.')
  }

  const senderEmail = process.env.EMAIL_FROM
    ? process.env.EMAIL_FROM.match(/<([^>]+)>/)?.[1] || process.env.EMAIL_FROM
    : 'admin@rugan.org'

  const senderName = process.env.EMAIL_FROM
    ? process.env.EMAIL_FROM.match(/^([^<]+)</)?.[1]?.trim() || 'RUGAN'
    : 'RUGAN'

  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  }

  if (replyTo) body.replyTo = { email: replyTo }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Brevo API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export async function sendEmailSafely(options, label = 'email notification') {
  if (!isEmailConfigured()) {
    console.warn(`Email skipped: ${label}. Email configuration is incomplete.`)
    return { ok: false, skipped: true }
  }

  try {
    await sendEmail(options)
    return { ok: true }
  } catch (error) {
    console.error(`Email send failed: ${label}`, error)
    return { ok: false, error }
  }
}

export async function sendBulkEmailSafely(messages, label = 'bulk email notification') {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: true, total: 0, sent: 0, failed: 0, skipped: false }
  }

  if (!isEmailConfigured()) {
    console.warn(`Email skipped: ${label}. Email configuration is incomplete.`)
    return {
      ok: false,
      skipped: true,
      total: messages.length,
      sent: 0,
      failed: messages.length,
    }
  }

  const results = await Promise.all(messages.map((message) => sendEmailSafely(message, label)))
  const sent = results.filter((result) => result.ok).length
  const failed = results.length - sent

  if (failed > 0) {
    console.warn(`Bulk email completed with failures: ${label}. Sent ${sent}/${results.length}.`)
  }

  return {
    ok: failed === 0,
    skipped: false,
    total: results.length,
    sent,
    failed,
  }
}