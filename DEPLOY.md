# Deploying PsychFlo

This project is a Next.js app and is easiest to deploy on Vercel.

## Recommended stack

- Hosting: Vercel
- Database/Auth: Supabase
- Payments: Stripe
- Emails: Resend
- Rate limiting: Upstash Redis

## Before you deploy

1. Create a Supabase project.
2. Run [supabase/schema.sql](/Users/arhamafaridi/Desktop/psychflo website/supabase/schema.sql) in the Supabase SQL editor.
3. Create a Vercel project and import this repo.
4. Add the environment variables from [.env.example](/Users/arhamafaridi/Desktop/psychflo website/.env.example) in Vercel Project Settings.
5. Set `NEXT_PUBLIC_URL` to your real production domain, for example `https://psychflo.com`.

## Minimum env vars to get the site online

These are the minimum vars for the site and auth routes to work:

- `NEXT_PUBLIC_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Optional env vars by feature

Stripe:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_TEAM_PRICE_ID`
- `STRIPE_GROWTH_PRICE_ID`
- `STRIPE_ENTERPRISE_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_SME_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_LARGE_PRICE_ID`

Email:

- `RESEND_API_KEY`

Slack:

- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_DEFAULT_CHANNEL`

Rate limiting:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Scheduled jobs:

- `CRON_SECRET`

## Supabase auth setup

In Supabase Auth URL settings:

- Set Site URL to your production URL, for example `https://your-domain.com`
- Add `http://localhost:3000/**` for local development
- Add your production URL patterns that your auth flows use
- If using Vercel preview deployments, also allow your Vercel preview URLs

This matters because this app uses redirect-based auth flows in:

- [app/api/auth/magic/route.js](/Users/arhamafaridi/Desktop/psychflo website/app/api/auth/magic/route.js)
- [app/api/org/route.js](/Users/arhamafaridi/Desktop/psychflo website/app/api/org/route.js)

## Stripe setup

If you want paid plans live:

1. Create the products and recurring prices in Stripe.
2. Add the resulting price IDs to Vercel env vars.
3. Create a Stripe webhook endpoint pointing to:

`https://your-domain.com/api/stripe/webhook`

4. Subscribe the webhook to:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Cron setup

This repo includes a scheduled route at:

`/api/schedule`

If you want reminders to run automatically, configure a platform cron to hit that route and send:

`Authorization: Bearer <CRON_SECRET>`

## Launch checklist

- Production deploy succeeds
- Homepage loads
- `Pricing`, `Blog`, `Microlearn`, `Login`, and `Sign up` links work
- Signup creates a user and organisation
- Login works
- Magic link redirects to production URL, not localhost
- Stripe checkout opens correctly
- Stripe webhook updates organisation plan
- Email flows send successfully
- Domain DNS is connected

## Important note

This workspace currently does not have `node` or `npm` installed, so local build verification could not be run from here.
