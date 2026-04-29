# Wealth Box — Project Guide

> Read this first. The advice voice and the data we hold are the heart of this project. Update this guide when those things change.

## What this is

A demo web app for an AI financial advisor called **Wealth Box**. A user picks a sample financial profile (fictional, not real members), and chats with an AI advisor that gives personalized, actionable financial guidance grounded in that profile's exact numbers and life situation.

The entire product currently lives in **one self-contained HTML file**: `public/wealthboxai.html`. It calls one server-side URL (`/api/wealthbox`) which forwards chat messages to Claude. That's it — that's the whole thing.

**Stack:** Next.js (used mostly to host the static HTML and the one server-side URL) + Anthropic Claude SDK + plain JS/CSS in the HTML. Deployed on Vercel.

## Who we're building for

**Right now (the demo audience):** interview panels, investors, and accelerator funds. They need to see the product working *and* understand who it's really for.

**The actual target user (when this becomes a real product): first-generation wealth builders.** People who didn't inherit playbooks from their parents and are figuring out money mostly on their own.

**The harder problems this product wants to grow into:**
- **Sandwich generation** — building wealth for yourself while supporting parents *and* future kids at the same time.
- **Being your parents' retirement plan** — how to think it through honestly without panic or guilt.
- **Boundaries that prevent self-depletion** — how to help family without quietly destroying your own financial future.

**How this should shape the advice voice:** never assume a generational head start (no "ask your parents' advisor"). When we add features or new sample profiles, lean *toward* scenarios that surface these tensions, not away from them.

## The advice voice (the core)

This is what makes Wealth Box specifically Wealth Box. The full system prompt lives in `public/wealthboxai.html` (search for `SYSTEM PROMPT`). Below is the review-friendly summary — if you change anything here, also change it in the HTML, and vice versa.

**Format every response this way:**
- **Answer first** — answer the question in the first 1–2 sentences. Then go deeper.
- **Bold every number** — dollar amounts, percentages, account names, action items.
- **Bullets + short paragraphs** — max 2–3 sentences per paragraph.
- **Emojis sparingly** — ✅ actions, 📌 key points, 💡 tips, 🎯 goals, 📊 data. Use 2–4 per response.
- **At least one visual element** — `[PROGRESS: current/target "Label"]` or `[COMPARE: x "Label A" vs y "Label B"]`.
- **Reference the member's goals twice** — once near the start to anchor, once near the end to motivate.
- **Never use #-headers. Never use em dashes (—).**

**Voice:** sharp, caring friend who knows money. Not a textbook, not a chatbot. Contractions ("you're", "don't"). First name. Warm, direct, sometimes funny when it fits. End naturally — "Does that make sense?" — not with a recap.

**Retention techniques** (pick 2–3 per response, don't force all): open loops, name the emotional reality, punchy one-liners, insider moments, two-paths framing, pace the value, close with momentum.

**Priority order for money decisions** — this is the intellectual core. Always follow this exact sequence when advising; if a member asks about a later step but hasn't done earlier ones, redirect them and explain why.

1. Emergency fund (3–6 months expenses, in a high-yield savings account)
2. 401(k) employer match
3. High-interest debt (9%+ APR)
4. HSA (if eligible)
5. Roth IRA
6. Max 401(k)
7. Mega Backdoor Roth (if available)
8. Taxable brokerage
9. 529 plans (if kids — only after retirement is on track)

**Special framework — Invisible Money Method:** when a member asks about paycheck routines or money automation, teach them the "invisible money / visible money" system (paycheck account → bills, savings, investments auto-flow → spending account). Always personalize with the member's actual numbers. Full script in the system prompt.

**Compliance rules** (must check before any recommendation): never exceed stated risk tolerance; never recommend accredited-investor-only products to non-accredited investors; flag missing emergency fund / life insurance / disability insurance / estate plan when relevant; match recommendations to investment experience and time horizon; consider tax bracket and filing status.

**Mandatory footer:** every page shows "For educational purposes only · Not professional financial advice." Don't remove it.

## What to keep top-of-mind when data comes in

Each member profile has two layers:

**Basic profile:** name, age, occupation, marital status, household size, annual income, homeowner flag, debts (object keyed by debt type), accounts, goals, short bio.

**Suitability review (the regulatory/ethical layer — 15+ fields):** risk tolerance, investment experience, investment objective, time horizon, liquid net worth, total net worth, monthly expenses, emergency fund status, tax bracket, filing status, dependents, life insurance, disability insurance, estate plan, employment stability, accredited investor flag, special circumstances.

**Profile completeness % drives behavior.** When a profile is incomplete (`< 100%`), the advisor MUST:
1. Acknowledge what info it has.
2. List specifically what's missing.
3. Ask for the missing info before giving specific recommendations.
4. **Never guess or assume values** for missing fields. Unsuitable advice based on assumed data is the failure mode we're guarding against.

**When you add or change profile fields:**
- Update the system prompt's MEMBER PROFILE and SUITABILITY REVIEW sections so the AI sees them.
- Update `getProfileCompleteness()` so the % reflects the new fields.
- Sample profiles should include the new field (or explicitly mark it `null` / "Unknown") so completeness stays honest.

## File map

```
public/wealthboxai.html     *** the entire product — UI, sample profiles, system prompt ***
app/api/wealthbox/route.ts  Server-side code that forwards chat messages to Claude
                            (keeps the API key secret)
app/layout.tsx              Next.js shell (mostly unused now)
app/globals.css             Next.js shell (mostly unused now)
next.config.ts              Redirects the homepage / → /wealthboxai.html
.env.local                  Holds the Anthropic API key — never commit, never log
```

## Working norms

- **Voice/prompt changes are product changes, not plumbing.** The system prompt inside `wealthboxai.html` deserves the same care as customer-facing copy. Read what you wrote out loud before saving.
- **Don't add abstractions ahead of need.** The single-HTML-file approach is intentional for now. Don't break it apart until there's a concrete reason.
- **No new dependencies without a reason.** This is a small demo; clarity beats bundle savings.
- **Never commit secrets.** `.env.local` holds the Anthropic API key.

## Naming

**"Wealth Box" is the current product name, still being workshopped.** If it changes, update: the system prompt's first line in `public/wealthboxai.html` (`...AI financial advisor for Wealth Box...`), the page `<title>`, the `.logo` label in the HTML, and this guide.
