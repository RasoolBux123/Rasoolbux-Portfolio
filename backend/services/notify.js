// Sends an email to the site owner when someone uses the contact form.
// Uses Resend's HTTP API (Render free blocks SMTP). If the env vars are missing it does nothing.
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

async function notifyNewMessage(m) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: m.email,
        subject: `New portfolio message from ${m.name}`.replace(/[\r\n]+/g, " "),
        html: `
          <h3>New message on your portfolio</h3>
          <p><b>Name:</b> ${esc(m.name)}<br><b>Email:</b> ${esc(m.email)}</p>
          <p>${esc(m.message)}</p>
          <p style="color:#888">Reply to this email to answer them directly.</p>`,
      }),
    });
    if (!res.ok) console.error("Resend error:", res.status, await res.text());
  } catch (err) {
    console.error("Resend failed:", err.message); // never break the contact form over email
  }
}

module.exports = { notifyNewMessage };