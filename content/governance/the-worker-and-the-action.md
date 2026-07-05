When a company hires a person, it builds two kinds of structure. Standing structure: a role, a manager, permissions, reviews. Per-transaction structure: the purchase order, the approval, the second signature on the wire. Neither replaces the other.

Agents get neither. They arrive with a prompt and an API key. Their actions execute with no record of what they meant, who approved them, or how to undo them. The technology to act is here. The structure around the acting is not.

No one selling you AI is paid to point this out. Model vendors improve models, platforms grow usage, and the structure that decides whether any of it sticks is yours to build.

Building it means answering two kinds of questions, on two clocks.

**Standing questions.** What job does this agent do? What may it touch? Has it earned more trust? These change slowly, like onboarding and reviews.

**Runtime questions.** What is this action? Who allowed it? How does it get reversed? These arrive hundreds of times a day.

We built one project for each. [Lattice](lattice/) onboards the agent like a worker: context to do the job, limits on what it can touch, a named owner for the outcome. [Concord](concord/) puts a contract on each action: meaning, authority, undo.

<svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The governance stack: the organization on top, Lattice below it, Concord below that, enterprise systems at the bottom. Policy flows down from Lattice into Concord; Concord's ledger flows back up to Lattice." style="max-width:100%;height:auto;display:block;margin:28px auto;">
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="120" y="10" width="440" height="46" rx="5" fill="var(--panel-2)" stroke="var(--line-strong)"/>
    <text x="340" y="30" text-anchor="middle" font-size="13" font-weight="600" fill="var(--ink)">The organization</text>
    <text x="340" y="46" text-anchor="middle" font-size="10.5" fill="var(--muted)">people, policies, accountability</text>
    <rect x="120" y="88" width="440" height="72" rx="5" fill="var(--teal-bg)" stroke="var(--teal)"/>
    <text x="340" y="112" text-anchor="middle" font-size="14" font-weight="600" fill="var(--teal-deep)">Lattice — governs the worker</text>
    <text x="340" y="130" text-anchor="middle" font-size="10.5" fill="var(--ink-soft)">Ground · Govern · Graduate</text>
    <text x="340" y="146" text-anchor="middle" font-size="10.5" fill="var(--muted)">standing structure: role, context, permissions, trust level</text>
    <rect x="120" y="204" width="440" height="72" rx="5" fill="var(--orange-bg)" stroke="var(--orange)"/>
    <text x="340" y="228" text-anchor="middle" font-size="14" font-weight="600" fill="var(--orange-deep)">Concord — governs the action</text>
    <text x="340" y="246" text-anchor="middle" font-size="10.5" fill="var(--ink-soft)">propose → authorize → execute → record</text>
    <text x="340" y="262" text-anchor="middle" font-size="10.5" fill="var(--muted)">per-action contract: meaning, authority, undo</text>
    <rect x="120" y="308" width="440" height="42" rx="5" fill="var(--panel-2)" stroke="var(--line-strong)"/>
    <text x="340" y="333" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">Enterprise systems — tools, data, workflows</text>
    <line x1="340" y1="56" x2="340" y2="86" stroke="var(--muted-2)" stroke-width="1.5"/>
    <line x1="340" y1="276" x2="340" y2="306" stroke="var(--muted-2)" stroke-width="1.5"/>
    <line x1="205" y1="160" x2="205" y2="202" stroke="var(--teal-deep)" stroke-width="1.5"/>
    <text x="196" y="186" text-anchor="end" font-size="10" fill="var(--muted)">policy, enforced per action</text>
    <line x1="475" y1="204" x2="475" y2="162" stroke="var(--orange-deep)" stroke-width="1.5"/>
    <text x="484" y="186" text-anchor="start" font-size="10" fill="var(--muted)">ledger feeds the scorecard</text>
  </g>
</svg>

## The loop is the point

The layers close a loop. Downward: a policy like "credits over a threshold need approval" is a sentence in a binder until something checks it at the moment an agent acts. That checkpoint is the contract. Upward: deciding whether an agent deserves more trust takes evidence: how many actions were approved unchanged, corrected, reversed. That evidence is the contract ledger.

One without the other fails predictably. Onboarding without contracts: well-documented agents whose actions nobody can explain. Contracts without onboarding: perfectly audited actions by agents nobody decided to trust.

## Trust level sets the ceremony

An agent's trust level should set how much contract ceremony each action gets.

| Lattice level | What the agent may do | What each Concord contract does |
|---|---|---|
| 0 · Observe | Read context only | No contracts; nothing executes |
| 1 · Recommend | Suggest actions | Records the recommendation; a human decides |
| 2 · Draft | Prepare the artifact | Carries the draft; a human executes the contract |
| 3 · Act with approval | Execute after sign-off | Full contract with a human approval gate per action |
| 4 · Act within guardrails | Execute inside hard limits | Auto-approved within policy; exceptions escalate with full ceremony |
| 5 · Autonomous in bounds | Operate within a domain | Auto-approved in domain; audit and reversal intact, sampled review |

Promotion changes the ceremony, not the accountability. The audit trail never thins. What thins is how often a human stands in the path.

## What comes next

Each piece of the stack opens a question we haven't finished answering:

- **Autonomy levels as a shared scale.** Like driving automation: one vocabulary for "how much do you trust this agent."
- **Performance reviews for agents.** What an agent costs against what it returns.
- **Context packs.** How business knowledge, including the kind that lives in people's heads, gets handed to an agent.
- **The flipped org chart.** What management looks like when a few people oversee many agents.
- **The delegation you didn't sanction.** Most employees already hand work to personal AI tools, off the books. The same structure can bring it on the books.

If you run an organization, start with [Lattice, part 1](lattice/part-1-the-problem.html). If you build systems, start with [Concord, part 1](posts/concord-1-why-agents-need-a-contract.html).
