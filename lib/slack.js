export async function sendSlackWebhook(webhookUrl, payload) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Slack webhook error: ${res.status}`);
}

export async function sendSlackMessage(botToken, channel, payload) {
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${botToken}`,
    },
    body: JSON.stringify({ channel, ...payload }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API error: ${data.error}`);
  return data;
}

export function buildAlertPayload({ type, score, flags, name, tool }) {
  const scoreColor = score >= 70 ? "#6ee7b7" : score >= 50 ? "#c9a84c" : "#f87171";
  const emoji = score >= 70 ? "✅" : score >= 50 ? "⚠️" : "🚨";

  return {
    text: `${emoji} PsychFlo safety alert`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `${emoji} Safety alert — ${tool}` },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Safety score*\n${score}/100` },
          { type: "mrkdwn", text: `*Source*\n${name || tool}` },
        ],
      },
      flags?.length > 0 && {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Flags detected:*\n${flags.map(f => `• ${f}`).join("\n")}`,
        },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: "_Sent by PsychFlo — your psychological safety platform_" },
      },
    ].filter(Boolean),
  };
}

export function buildCheckinPayload({ channel, message, linkUrl }) {
  return {
    text: message,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*PsychFlo check-in* 👋\n\n${message}`,
        },
      },
      linkUrl && {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Complete check-in →" },
            url: linkUrl,
            style: "primary",
          },
        ],
      },
    ].filter(Boolean),
  };
}
