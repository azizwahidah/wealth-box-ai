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

The priority order has two zones: a **floor** (sequential, do these in order) and a **parallel block** (concurrent, split monthly cash across them).

**Floor (sequential):**

1. **Employer match** — 401(k), 403(b), or 401(a). This is **#1 only if they have access to a match.** It's free money with a deadline (every paycheck you skip it, it's gone forever). Three cases:
   - **Confirmed they have a match:** put it at #1, full stop.
   - **Unknown / not in their data:** still put it at #1, with a "verify with HR — confirm the plan exists and the match formula" disclaimer. Don't assume there isn't one.
   - **Confirmed no match available:** drop it from the list. Emergency fund becomes #1.
2. Emergency fund (3–6 months expenses, in a high-yield savings account)
3. **Active floor goals** — any goal the member has toggled on with `slot: 'floor'` (typically `kind: 'survival'` items like a monthly remittance for family). Real recurring obligations that must be funded before discretionary debt payoff and investing.
4. High-interest debt (9%+ APR) — credit cards, personal loans

**Parallel (concurrent — split remaining monthly cash; these items are all use-it-or-lose-it):** every enabled non-floor goal + canonical items with annual caps or fixed timelines:

- Active parallel goals (debt payoff at sub-9% rates, home downpayment, family help, FIRE number, etc.)
- HSA (if eligible) — annual cap; skipping a year forfeits that year's room.
- Roth IRA — $7K/yr cap, use-it-or-lose-it.
- 529 plans (if kids) — kids age into college on a fixed timeline.

The advisor's job in the parallel block is to size monthly contributions per goal to actual deadlines, not max each one in sequence.

**Surplus (only after the parallel block is on track):** items with no annual cap and no fixed deadline — where leftover cash flows.

- Max 401(k) toward the $23,500/yr cap (above the match — the match itself sits in the floor)
- Mega Backdoor Roth (if their plan allows)
- Taxable brokerage

These are NOT in the parallel block because they have no use-it-or-lose-it pressure beyond what's already in the floor (the match). Funding a parallel goal short while pushing toward the 401(k) cap or taxable brokerage means you're picking the wrong order — every parallel item has a deadline that the surplus items don't.

**Goals are unified and toggleable.** There is no separate "sub-goals" concept anymore. The profile's `goals` array is one list of objects, every item toggleable. Each goal carries: `amount`, `cadence` (`monthly`/`one-time`), `targetYear`, `currentSaved`, `kind` (`survival`/`cash`/`debt`/`invest`), `slot` (`floor`/`parallel`), and for debt goals an `interestRate`. Toggled-OFF goals are intentionally excluded from the priority list, the feasibility math, and the AI's awareness — don't mention them.

**Income growth assumption.** Every projection assumes the member will continue working and getting a **3% raise per year**. Surfaced as a fixed assumption in the UI (income box hover) — not editable for now, since per-user customization adds noise without much signal at this stage.

**Interest rate assumptions (demo defaults).** Real intake will collect these per debt; for now the sample profiles use: **credit cards 25%, student loans 6%, mortgages 4%, car loans 6%, business loans 7%.** Each rate shows inline on its debt row (with a hover tooltip explaining it's an assumption). Debt-payoff math uses the standard loan amortization formula (`PMT = P·i / (1−(1+i)^−n)`), not simple division.

**Return rate assumptions.** Investments earn **8%** nominal long-term (default for retirement, brokerage, college savings, FIRE goals — anything `kind: 'invest'`). Emergency fund + short-term cash savings (`kind: 'cash'`, `kind: 'survival'` for HYSA-style purposes) earn **3%**. Home value appreciates **3%** nominal. The net-worth simulation in the gameplan modal uses these to project a 10-year curve that re-runs on every toggle.

**Net worth model = assets − liabilities.** The simulation tracks: cash bucket (e-fund + cash savings goals), invest bucket (retirement + brokerage + invest-kind goal balances), home value (homeowners only), minus all debt balances. Each profile carries an `assets: { homeValue, retirementBalance }` field for the starting state — `homeValue: 0` for renters; `retirementBalance` is everything in invest accounts beyond the liquid emergency fund. As parallel debt goals get funded, the balance compounds down (less interest accrues each year, more of the next payment hits principal).

**Debt-payment model + freed cash on payoff.** Every debt amortizes naturally per a standard term (mortgage 30yr, student 10yr, business 7yr, car 5yr, credit card 5yr generous baseline). `monthlyExpenses` is treated as `non-debt portion (constant) + sum of every loan's standard amortized minimum`. Each year the simulation:

1. Computes `effectiveExpenses = nonDebtExpenses + sum(baseline_pmt for every debt with balance > 0)`.
2. Cash pool = take-home − effectiveExpenses − monthly survival commitments.
3. For non-attacked, non-HID debts: applies the baseline payment to balance (natural amortization → balance pays down).
4. For HID debts: baseline + EXTRA principal (pulled from cash pool) to hit the accelerated 24-mo target.
5. For parallel-goal debts: baseline + EXTRA principal (pro-rated from pool) to hit the goal's target year.
6. As loans pay off (naturally per their term, or accelerated by HID/goal attacks), their baseline drops out of `effectiveExpenses` → cash pool grows the following year → freed cash automatically funds the next priority.

This is what makes the "kill the CC and the next month $X more flows to the next goal" dynamic visible in the chart.

**Timeline math — make goals fit the years they have.** Goals after the priority floor should be sized to the member's actual deadlines, not to maximum-possible savings.

- If a member wants a house downpayment in 2035 and isn't retiring until 2065, don't push them to max the 401(k) at the expense of the downpayment. Right-size each contribution to the goal's timeline.
- Always do the math: given current cash flow + 3% raises + reasonable return assumptions, can each goal be hit by its target year?
- If they can hit all goals: say so, show the monthly contributions, and frame what's left over.
- If they can't: tell them honestly. The three levers are **earn more, change goals (later target / smaller amount / drop one), or spend less.** Quantify it: "to hit all three on your current timeline, you'd need about **$X more income per year** or to push the house out to **20XX**." Usually it's a mix, not all one lever.

**Special framework — Invisible Money Method:** when a member asks about paycheck routines or money automation, teach them the "invisible money / visible money" system (paycheck account → bills, savings, investments auto-flow → spending account). Always personalize with the member's actual numbers. Full script in the system prompt.

**Compliance rules** (must check before any recommendation): never exceed stated risk tolerance; never recommend accredited-investor-only products to non-accredited investors; flag missing emergency fund / life insurance / disability insurance / estate plan when relevant; match recommendations to investment experience and time horizon; consider tax bracket and filing status.

**Mandatory footer:** every page shows "For educational purposes only · Not professional financial advice." Don't remove it.

## What to keep top-of-mind when data comes in

Each member profile has two layers:

**Basic profile:** name, age, occupation, marital status, household size, annual income, homeowner flag, debts (object keyed by debt type), `debtRates` (parallel object with assumed APRs per debt), `accs`, `goals` (unified toggleable list — see schema in the priority order section), `matchAccess` (`'yes'` / `'no'` / `'unknown'`), short bio.

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
