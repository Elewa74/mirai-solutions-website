const MAX = 500;

function clean(value) {
  return typeof value === "string" ? value.trim().slice(0, MAX) : "";
}

export function validateAuditLead(input) {
  const source = input && typeof input === "object" ? input : {};
  const data = {
    name: clean(source.name),
    company: clean(source.company),
    website: clean(source.website),
    businessType: clean(source.businessType),
    improvementGoal: clean(source.improvementGoal),
    email: clean(source.email),
    whatsapp: clean(source.whatsapp),
    budget: clean(source.budget),
    timeline: clean(source.timeline),
    scanScore: clean(source.scanScore)
  };
  const errors = {};
  for (const key of ["name", "company", "businessType", "improvementGoal", "email", "whatsapp"]) {
    if (!data[key]) errors[key] = "Required";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email";
  if (data.website) {
    try {
      const url = new URL(data.website);
      if (!/^https?:$/.test(url.protocol)) errors.website = "Invalid URL";
    } catch {
      errors.website = "Invalid URL";
    }
  }
  if (data.whatsapp && !/^\+?[0-9\s()-]{8,25}$/.test(data.whatsapp)) errors.whatsapp = "Invalid WhatsApp number";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function buildWhatsAppMessage(lead, locale = "en") {
  if (locale === "ar") {
    return `مرحبًا Mirai، أنا ${lead.name} من ${lead.company}. أرسلت طلب Free Digital Presence Audit وأرغب في المتابعة عبر WhatsApp.`;
  }
  return `Hi Mirai, I'm ${lead.name} from ${lead.company}. I just submitted a Free Digital Presence Audit request${lead.website ? ` for ${lead.website}` : ""} and would like to continue on WhatsApp.`;
}
