#!/usr/bin/env node
// Usage: node setup-slack.js <your-slack-config-token>
// Get your config token at: https://api.slack.com/apps → "Generate Token" (top right)

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const configToken = process.argv[2];
if (!configToken) {
  console.error("\nUsage: node setup-slack.js <config-token>");
  console.error("\nGet your token at: https://api.slack.com/apps");
  console.error("Click 'Generate Token' in the top right, select your workspace, copy the token.\n");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "slack-app-manifest.json"), "utf8"));

async function run() {
  console.log("\n1. Creating Slack app from manifest…");

  const res = await fetch("https://slack.com/api/apps.manifest.create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${configToken}`,
    },
    body: JSON.stringify({ manifest }),
  });

  const data = await res.json();

  if (!data.ok) {
    console.error(`\nFailed to create Slack app: ${data.error}`);
    if (data.error === "invalid_auth") {
      console.error("Your config token is invalid or expired. Generate a fresh one at https://api.slack.com/apps\n");
    }
    process.exit(1);
  }

  const clientId = data.credentials?.client_id;
  const clientSecret = data.credentials?.client_secret;
  const appId = data.app_id;

  console.log(`   ✓ App created (ID: ${appId})`);
  console.log(`   Client ID: ${clientId}`);

  console.log("\n2. Adding credentials to Vercel…");

  try {
    execSync(`npx vercel env add SLACK_CLIENT_ID production --force <<< "${clientId}"`, { stdio: "pipe", shell: "/bin/bash" });
  } catch {
    // Vercel CLI doesn't support heredoc — use echo pipe
  }

  // Use vercel env add via stdin pipe
  const addEnvVar = (name, value) => {
    try {
      const result = execSync(
        `printf '%s' '${value}' | npx vercel env add ${name} production --force`,
        { stdio: ["pipe", "pipe", "pipe"], shell: "/bin/bash" }
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  const idOk = addEnvVar("SLACK_CLIENT_ID", clientId);
  const secretOk = addEnvVar("SLACK_CLIENT_SECRET", clientSecret);

  if (idOk && secretOk) {
    console.log("   ✓ SLACK_CLIENT_ID added to Vercel");
    console.log("   ✓ SLACK_CLIENT_SECRET added to Vercel");
  } else {
    console.log("\n   Vercel CLI couldn't add them automatically. Add manually:\n");
    console.log(`   SLACK_CLIENT_ID     = ${clientId}`);
    console.log(`   SLACK_CLIENT_SECRET = ${clientSecret}`);
    console.log("\n   → vercel.com/dashboard → your project → Settings → Environment Variables\n");
  }

  console.log("\n3. Triggering Vercel redeploy…");
  try {
    execSync("npx vercel --prod --yes", { stdio: "inherit" });
    console.log("   ✓ Deployed");
  } catch {
    console.log("   Trigger a redeploy manually at vercel.com or push any commit.\n");
  }

  console.log("\n✅ Done! Go to psychflo-website.vercel.app/integrations");
  console.log("   The 'Add to Slack' button will now appear.\n");
  console.log(`   Install your app at: https://api.slack.com/apps/${appId}/install-on-team\n`);
}

run().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
