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
      subject: `Update your rates for ${vendorName} | RateWala`,
      html: `
        <p>Hello,</p>
        <p>Your business listing <strong>${vendorName}</strong> has not been updated in <strong>${daysSinceUpdate} days</strong>.</p>
        <p>Please update your price list so customers see accurate rates:</p>
        <p><a href="${dashboardUrl}">${dashboardUrl}</a></p>
        <p>— RateWala Team</p>
      `,
    }),
  });

  return response.ok;
}
