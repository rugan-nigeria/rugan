// Plug in nodemailer or any email provider here
async function sendEmail({ to, subject, html }) {
  console.log(`Email to: ${to}, subject: ${subject}`)
  // TODO: implement with nodemailer
}

module.exports = { sendEmail }
