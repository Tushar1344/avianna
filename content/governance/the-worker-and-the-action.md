When a company hires a person, it builds two kinds of structure around them. The first is standing structure: a role, an onboarding, permissions, a manager, performance reviews, a path to promotion. The second is per-transaction structure: the expense report, the purchase order, the approval on the contract they want to sign. Neither substitutes for the other. A well-onboarded employee still cannot wire money without a second signature, and a perfectly designed approval form does not tell you whether the employee should be trusted with bigger work next quarter.

Companies putting AI agents to work are missing both kinds of structure. An agent arrives with a prompt and an API key: no role, no onboarding, no manager, no probation period. And each action it takes executes with no record of what it meant, who authorized it, or how to reverse it. The technology to act is here. The structure around the acting is not.

Do not expect anyone selling you AI to point this out. Capability vendors are paid to improve the model, platforms are paid when usage grows, and neither earns anything when you pause to build the structure that decides whether any of it sticks. This layer is yours to build.

Building it means answering two different kinds of questions, on two different clocks.

**Standing questions.** What job is this agent here to do? What does it need to know? What may it see and touch? Has it earned more trust? These change slowly, on the timescale of onboarding, reviews, and promotions.

**Runtime questions.** What is this specific action? Was it allowed, and by whom? What did it mean in business terms? If it was wrong, how does it get reversed? These arrive hundreds of times a day.

We built one project for each. [Lattice](lattice/) onboards the agent like a worker: context to do the job, limits on what it can touch, a named owner for the outcome. [Concord](concord/) puts a contract on each action: meaning, authority, undo. The rest of this note is how the two layers fit together, and what the combined stack points to next.

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

The two layers are not merely stacked. They close a loop, and the loop is what makes governance real rather than aspirational.

Downward: policy needs an enforcement point. A Lattice policy like "credits over a threshold require approval" is a sentence in a binder until something checks it at the moment an agent proposes a credit. That checkpoint is the per-action contract. Concord is where Lattice's rules stop being documentation and start being enforced.

Upward: trust needs evidence. Lattice's scorecard and graduation decisions have to be grounded in what the agent actually did. How many actions did it propose? How many were approved unchanged, how many were corrected, how many had to be reversed? That record is exactly what Concord's ledger accumulates, action by action. The ledger is the evidence the scorecard reads. Without it, graduation decisions run on impressions.

One layer without the other fails in a predictable direction. Standing structure without per-action contracts produces well-documented agents whose individual actions nobody can explain or undo. Per-action contracts without standing structure produce beautifully audited actions by agents nobody decided to trust in the first place.

## Trust level sets the ceremony

The most concrete connection between the layers: an agent's Lattice trust level should determine how much contract ceremony Concord applies to each of its actions.

| Lattice level | What the agent may do | What each Concord contract does |
|---|---|---|
| 0 · Observe | Read context only | No contracts; nothing executes |
| 1 · Recommend | Suggest actions | Records the recommendation; a human decides |
| 2 · Draft | Prepare the artifact | Carries the draft; a human executes the contract |
| 3 · Act with approval | Execute after sign-off | Full contract with a human approval gate per action |
| 4 · Act within guardrails | Execute inside hard limits | Auto-approved within policy; exceptions escalate with full ceremony |
| 5 · Autonomous in bounds | Operate within a domain | Auto-approved in domain; audit and reversal intact, sampled review |

Read the table twice and the loop appears again: graduation up the levels is earned by ledger evidence from the previous level, and each promotion changes the ceremony, not the accountability. The audit trail never thins. What thins is how often a human stands in the path.

## What the stack foreshadows

Treat Lattice and Concord as the first two entries in a longer research program. Each pillar, pulled on, unspools into work we have not written yet:

- **Autonomy levels as shared vocabulary.** The 0 to 5 ladder wants to become a standard the industry can point at, the way driving automation has levels. A common scale for "how much do you trust this agent" would let buyers, vendors, and auditors talk about the same thing.
- **Performance management for digital labor.** The scorecard grows into evaluation in production, trust metrics, and eventually unit economics: what an agent's outcomes cost against what they return.
- **Context packs.** The Ground pillar implies a discipline for packaging business knowledge for agents, including the undocumented judgment that lives in people's heads.
- **The hybrid organization.** When the human-to-agent ratio flips, spans of control, escalation paths, and the manager-of-agents role all need rethinking.
- **The delegation ledger.** Most companies already have ungoverned delegation: employees handing work to personal AI tools with no record of what was delegated or under whose authority. The same primitives that onboard sanctioned agents can instrument the unsanctioned ones.

Each of these is an open question, not a finished framework. That is deliberate. The stack above is what we are confident about; the list here is what we are working on.

If you are starting from the executive side, begin with [Lattice, part 1](lattice/part-1-the-problem.html). If you are starting from the systems side, begin with [Concord, part 1](posts/concord-1-why-agents-need-a-contract.html).
