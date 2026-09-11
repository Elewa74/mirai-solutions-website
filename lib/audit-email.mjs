function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildLeadEmail(lead) {
  const subject = `New Mirai audit request — ${lead.name} / ${lead.company}`;
  const lines = [
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Business type: ${lead.businessType}`,
    `Website: ${lead.website || "Not provided"}`,
    `Goal: ${lead.improvementGoal}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Budget range: ${lead.budget || "Not provided"}`,
    `Timeline: ${lead.timeline || "Not provided"}`,
    `Instant scan score: ${lead.scanScore || "Not run"}`
  ];
  const html = `<h2>New Mirai audit request</h2>${lines.map((line) => {
    const [label, ...rest] = line.split(": ");
    return `<p><strong>${esc(label)}:</strong> ${esc(rest.join(": "))}</p>`;
  }).join("")}`;
  return { subject, text: lines.join("\n"), html };
}
