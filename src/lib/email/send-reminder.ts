interface StaleReminderEmailInput {
  to: string;
  vendorName: string;
  daysSinceUpdate: number;
  dashboardUrl: string;
}

export async function sendStaleReminderEmail({
  to,
  vendorName,
  daysSinceUpdate,
  dashboardUrl,
}: StaleReminderEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "RateWala <onboarding@resend.dev>";

  if (!apiKey) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${vendorName} — apni rates update karein | RateWala`,
      html: `
        <p>Assalam-o-Alaikum,</p>
        <p>Aapki business listing <strong>${vendorName}</strong> ki rates <strong>${daysSinceUpdate} din</strong> se update nahi hui.</p>
        <p>Customers ko sahi prices dikhane ke liye apna price list update karein:</p>
        <p><a href="${dashboardUrl}">${dashboardUrl}</a></p>
        <p>— RateWala Team</p>
      `,
    }),
  });

  return response.ok;
}
