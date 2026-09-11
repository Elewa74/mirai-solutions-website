function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Internal notification sent to MIRAI_LEAD_EMAIL through Resend. */
export function buildConsultationEmail(lead, locale = "en") {
  const subject = `New consultation request — ${lead.name} / ${lead.company}`;
  const rows = [
    ["Name", lead.name],
    ["Company / Organization", lead.company],
    ["Email", lead.email],
    ["WhatsApp", lead.whatsapp],
    ["Business type", lead.businessType],
    ["Interested in", lead.interest],
    ["Website", lead.website || "Not provided"],
    ["Language", locale === "ar" ? "Arabic" : "English"],
    ["What they need", lead.message]
  ];
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<h2>New consultation request</h2>${rows.map(([label, value]) => `<p><strong>${esc(label)}:</strong> ${esc(value).replaceAll("\n", "<br>")}</p>`).join("")}`;
  return { subject, text, html };
}
