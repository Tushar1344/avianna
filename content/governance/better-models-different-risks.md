A model that writes a bad answer creates a quality problem.

An agent that can search company records, update a customer account, send an email, or move money can create an operational problem.

This distinction will matter more as AI models improve.

The usual discussion treats capability as a single upward curve. Models become better at reasoning, planning, using tools, and completing longer tasks. The assumption is that better capability will make enterprise AI safer and more reliable.

That is partly true. More capable models should misunderstand fewer instructions, make better plans, select tools more accurately, and recover from simple mistakes. But capability also changes the reach of a system. A model that once produced a paragraph can now carry out a sequence of actions. It can work for longer, touch more systems, and affect more people.

Some risks decline. Others grow.

<svg viewBox="0 0 680 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two curves against model capability. Errors of understanding decline as capability rises. Errors of consequence rise. The curves cross: better models change the shape of risk, not the amount." style="max-width:100%;height:auto;display:block;margin:28px auto;">
  <style>
    .bmf1-line{stroke-dasharray:800;stroke-dashoffset:800;animation:bmf1-draw 1.8s ease-out forwards}
    .bmf1-b{animation-delay:.5s}
    @keyframes bmf1-draw{to{stroke-dashoffset:0}}
    .bmf1-fade{opacity:0;animation:bmf1-in .7s ease-out 1.9s forwards}
    @keyframes bmf1-in{to{opacity:1}}
    @media (prefers-reduced-motion: reduce){.bmf1-line{animation:none;stroke-dashoffset:0}.bmf1-fade{animation:none;opacity:1}}
  </style>
  <g font-family="Inter, system-ui, sans-serif">
    <line x1="70" y1="272" x2="645" y2="272" stroke="var(--line-strong)" stroke-width="1.5"/>
    <line x1="70" y1="272" x2="70" y2="38" stroke="var(--line-strong)" stroke-width="1.5"/>
    <text x="357" y="298" text-anchor="middle" font-size="11" fill="var(--muted)">model capability →</text>
    <text x="52" y="155" text-anchor="middle" font-size="11" fill="var(--muted)" transform="rotate(-90 52 155)">risk</text>
    <path class="bmf1-line" d="M 70 72 C 240 82, 400 195, 640 243" fill="none" stroke="var(--teal)" stroke-width="2.5"/>
    <path class="bmf1-line bmf1-b" d="M 70 243 C 240 233, 400 120, 640 62" fill="none" stroke="var(--orange)" stroke-width="2.5"/>
    <g class="bmf1-fade">
      <text x="638" y="232" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--teal-deep)">Errors of understanding</text>
      <text x="638" y="247" text-anchor="end" font-size="10" fill="var(--muted)">misread intent · brittle plans · wrong tool</text>
      <text x="638" y="42" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--orange-deep)">Errors of consequence</text>
      <text x="638" y="57" text-anchor="end" font-size="10" fill="var(--muted)">reach · velocity · blast radius</text>
      <circle cx="368" cy="157" r="3.5" fill="var(--ink)"/>
      <text x="368" y="142" text-anchor="middle" font-size="10" fill="var(--ink-soft)">the shape of risk changes here</text>
    </g>
  </g>
</svg>

The useful question is not whether better models increase or decrease risk in general. It is how they change the shape of risk.

## Capability increases reach

One way to see this shift is to look at the length of tasks models can complete.

METR measures the duration of software tasks that AI agents can complete with a specified probability of success. Its results show rapid growth in the time horizon of frontier models. The growth is not uniform — METR found visual computer-use horizons roughly 40 to 100 times shorter than software and reasoning horizons — but the direction is clear. Models are becoming able to stay with a problem for longer.

That is valuable, because many enterprise processes are not single questions. They are sequences. Resolving a customer complaint may require finding the customer, reading the account history, checking the current policy, reviewing previous cases, calculating an amount, updating a system, and communicating the decision. The longer the sequence a model can manage, the more of the process it can perform.

The same improvement creates a new failure mode: an error near the beginning of a long workflow can travel.

Suppose an agent incorrectly decides that a customer is eligible for a refund. What happens next depends entirely on how much of the workflow the agent owns:

<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two workflow lanes. In the recommend-only lane, a wrong eligibility call reaches a human review gate and stops. In the execute lane, the same wrong call flows through selecting the order, issuing the payment, updating the record, and emailing the customer: one wrong premise, four systems changed." style="max-width:100%;height:auto;display:block;margin:28px auto;">
  <style>
    .bmf2-n{animation:bmf2-flip .4s ease-out forwards}
    .bmf2-t{animation:bmf2-tint .4s ease-out forwards}
    .bmf2-d1{animation-delay:.4s}.bmf2-d2{animation-delay:1.1s}.bmf2-d3{animation-delay:1.8s}.bmf2-d4{animation-delay:2.5s}.bmf2-d5{animation-delay:3.2s}
    @keyframes bmf2-flip{to{fill:var(--orange-bg);stroke:var(--orange)}}
    @keyframes bmf2-tint{to{fill:var(--orange-deep)}}
    .bmf2-cap{opacity:0;animation:bmf2-in .6s ease-out 3.7s forwards}
    @keyframes bmf2-in{to{opacity:1}}
    @media (prefers-reduced-motion: reduce){.bmf2-n{animation:none;fill:var(--orange-bg);stroke:var(--orange)}.bmf2-t{animation:none;fill:var(--orange-deep)}.bmf2-cap{animation:none;opacity:1}}
  </style>
  <g font-family="Inter, system-ui, sans-serif">
    <text x="32" y="34" font-size="11" font-weight="600" fill="var(--muted)" letter-spacing="1">TRUST LEVEL: RECOMMEND</text>
    <rect class="bmf2-n bmf2-d1" x="32" y="48" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d1" x="88" y="68" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Misjudges</text>
    <text class="bmf2-t bmf2-d1" x="88" y="82" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">eligibility</text>
    <line x1="144" y1="71" x2="156" y2="71" stroke="var(--muted-2)" stroke-width="1.5"/>
    <rect class="bmf2-n bmf2-d2" x="158" y="48" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d2" x="214" y="68" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Drafts refund</text>
    <text class="bmf2-t bmf2-d2" x="214" y="82" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">recommendation</text>
    <line x1="270" y1="71" x2="282" y2="71" stroke="var(--muted-2)" stroke-width="1.5"/>
    <rect x="284" y="48" width="112" height="46" rx="5" fill="var(--teal-bg)" stroke="var(--teal)"/>
    <text x="340" y="68" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--teal-deep)">Human review</text>
    <text x="340" y="82" text-anchor="middle" font-size="10.5" fill="var(--teal-deep)">✕ stops here</text>
    <text class="bmf2-cap" x="412" y="75" font-size="10.5" fill="var(--muted)">the mistake is caught as an output error</text>
    <text x="32" y="164" font-size="11" font-weight="600" fill="var(--muted)" letter-spacing="1">TRUST LEVEL: EXECUTE END-TO-END</text>
    <rect class="bmf2-n bmf2-d1" x="32" y="178" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d1" x="88" y="198" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Misjudges</text>
    <text class="bmf2-t bmf2-d1" x="88" y="212" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">eligibility</text>
    <line x1="144" y1="201" x2="156" y2="201" stroke="var(--muted-2)" stroke-width="1.5"/>
    <rect class="bmf2-n bmf2-d2" x="158" y="178" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d2" x="214" y="198" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Selects</text>
    <text class="bmf2-t bmf2-d2" x="214" y="212" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">the order</text>
    <line x1="270" y1="201" x2="282" y2="201" stroke="var(--muted-2)" stroke-width="1.5"/>
    <rect class="bmf2-n bmf2-d3" x="284" y="178" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d3" x="340" y="198" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Issues</text>
    <text class="bmf2-t bmf2-d3" x="340" y="212" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">the payment</text>
    <line x1="396" y1="201" x2="408" y2="201" stroke="var(--muted-2)" stroke-width="1.5"/>
    <rect class="bmf2-n bmf2-d4" x="410" y="178" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d4" x="466" y="198" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Updates</text>
    <text class="bmf2-t bmf2-d4" x="466" y="212" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">the record</text>
    <line x1="522" y1="201" x2="534" y2="201" stroke="var(--muted-2)" stroke-width="1.5"/>
    <rect class="bmf2-n bmf2-d5" x="536" y="178" width="112" height="46" rx="5" fill="var(--panel)" stroke="var(--line-strong)"/>
    <text class="bmf2-t bmf2-d5" x="592" y="198" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">Emails the</text>
    <text class="bmf2-t bmf2-d5" x="592" y="212" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--ink)">customer</text>
    <g class="bmf2-cap">
      <line x1="158" y1="244" x2="648" y2="244" stroke="var(--orange)" stroke-width="1.5"/>
      <line x1="158" y1="238" x2="158" y2="244" stroke="var(--orange)" stroke-width="1.5"/>
      <line x1="648" y1="238" x2="648" y2="244" stroke="var(--orange)" stroke-width="1.5"/>
      <text x="403" y="264" text-anchor="middle" font-size="11" font-weight="600" fill="var(--orange-deep)">one wrong premise, four systems changed</text>
      <text x="340" y="292" text-anchor="middle" font-size="10.5" fill="var(--muted)">The model has not become less reliable. It has become more consequential.</text>
    </g>
  </g>
</svg>

Long workflows also give small errors room to accumulate, and occasional large errors room to appear. A recent preprint from Microsoft Research examined delegated document-editing workflows across 52 professional domains and 19 models. Even the frontier models tested degraded an average of 25 percent of document content by the end of long workflows — and the errors were often sparse but severe, worsening with larger documents, longer interactions, and distracting files. Tool use did not solve the problem in that evaluation.

The study is one benchmark, not a universal measure of enterprise agents. But it illustrates an important pattern: success on individual steps does not guarantee that the full artifact or process remains intact over time. A model can look competent at every turn while the overall result slowly drifts.

## The risks that decline

Several risks should fall as models improve — and these gains are real. They will make more enterprise tasks economically viable.

| What declines | Why | Example |
|---|---|---|
| **Misunderstanding** | Better models infer what a person wants from incomplete, loosely worded instructions | "Sort out the Hendersons' billing issue" resolves to the right account and the right problem |
| **Planning failure** | Stronger decomposition, ordering, and replanning when new information appears | A complaint is worked account → policy → precedent → amount, not in a broken order |
| **Poor tool selection** | Models recognize when to search, retrieve, compute, or ask for human judgment | The agent queries the policy database instead of guessing from memory |
| **Brittle instruction following** | Less prompt engineering needed for valid structure and routine process | Fewer "output valid JSON or else" scaffolds in the product |
| **Routine correction** | Less human time on wording, obvious gaps, and simple reasoning slips | Reviewers stop fixing drafts and start reviewing decisions |

More capable models may also reduce risk directly. A strong model may notice that information is missing, identify a contradiction between two policies, question an unusual transaction, or recognize that an action exceeds its authority.

So the argument is not that stronger models are inherently less safe. The argument is that model quality addresses only part of the risk.

## The risks that grow

Six risks grow with capability — not because the model gets worse, but because the system around it gets bigger, faster, and more connected. The profile looks very different for an assistant that drafts and an agent that executes:

<svg viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Radar chart with six axes: reach, velocity, authority, coupling, tail exposure, and attack surface. A small teal polygon shows the risk profile of an assistant that only recommends and drafts. A much larger orange polygon shows the profile of an agent that executes end-to-end." style="max-width:100%;height:auto;display:block;margin:28px auto;">
  <style>
    .bmf3-p{transform-origin:340px 210px;transform:scale(0);animation:bmf3-grow .9s cubic-bezier(.2,.7,.3,1) forwards}
    .bmf3-agent{animation-delay:.6s}
    @keyframes bmf3-grow{to{transform:scale(1)}}
    .bmf3-cap{opacity:0;animation:bmf3-in .6s ease-out 1.5s forwards}
    @keyframes bmf3-in{to{opacity:1}}
    @media (prefers-reduced-motion: reduce){.bmf3-p{animation:none;transform:scale(1)}.bmf3-cap{animation:none;opacity:1}}
  </style>
  <g font-family="Inter, system-ui, sans-serif">
    <polygon points="340,70 461.2,140 461.2,280 340,350 218.8,280 218.8,140" fill="none" stroke="var(--line)" stroke-width="1"/>
    <polygon points="340,117 420.5,163.5 420.5,256.5 340,303 259.5,256.5 259.5,163.5" fill="none" stroke="var(--line)" stroke-width="1"/>
    <polygon points="340,163 380.7,186.5 380.7,233.5 340,257 299.3,233.5 299.3,186.5" fill="none" stroke="var(--line)" stroke-width="1"/>
    <line x1="340" y1="210" x2="340" y2="70" stroke="var(--line)" stroke-width="1"/>
    <line x1="340" y1="210" x2="461.2" y2="140" stroke="var(--line)" stroke-width="1"/>
    <line x1="340" y1="210" x2="461.2" y2="280" stroke="var(--line)" stroke-width="1"/>
    <line x1="340" y1="210" x2="340" y2="350" stroke="var(--line)" stroke-width="1"/>
    <line x1="340" y1="210" x2="218.8" y2="280" stroke="var(--line)" stroke-width="1"/>
    <line x1="340" y1="210" x2="218.8" y2="140" stroke="var(--line)" stroke-width="1"/>
    <polygon class="bmf3-p bmf3-agent" points="340,84 443.1,150.5 449.1,273 340,322 255.1,259 236.9,150.5" fill="var(--orange)" fill-opacity="0.14" stroke="var(--orange)" stroke-width="2"/>
    <polygon class="bmf3-p" points="340,182 370.3,192.5 358.2,220.5 340,238 303.6,231 297.6,185.5" fill="var(--teal)" fill-opacity="0.22" stroke="var(--teal-deep)" stroke-width="2"/>
    <text x="340" y="56" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--ink-soft)">Reach</text>
    <text x="472" y="134" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink-soft)">Velocity</text>
    <text x="472" y="292" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink-soft)">Authority</text>
    <text x="340" y="372" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--ink-soft)">Coupling</text>
    <text x="208" y="292" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--ink-soft)">Tail exposure</text>
    <text x="208" y="134" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--ink-soft)">Attack surface</text>
    <g class="bmf3-cap">
      <rect x="40" y="398" width="12" height="12" rx="2" fill="var(--teal)" fill-opacity="0.22" stroke="var(--teal-deep)"/>
      <text x="58" y="408" font-size="11" fill="var(--ink-soft)">Assistant — recommends and drafts</text>
      <rect x="300" y="398" width="12" height="12" rx="2" fill="var(--orange)" fill-opacity="0.14" stroke="var(--orange)"/>
      <text x="318" y="408" font-size="11" fill="var(--ink-soft)">Agent — executes end-to-end, across systems</text>
    </g>
  </g>
</svg>

| What grows | What changes | Example |
|---|---|---|
| **Reach** | A capable agent keeps acting after an early mistake — a trail of individually valid actions built on an invalid premise | The wrong eligibility call above: order selected, payment issued, record updated, email sent |
| **Velocity** | A person makes one incorrect change at a time; an agent repeats the error at machine speed | The same bad discount applied to thousands of accounts before anyone notices the pattern |
| **Authority** | Recommending becomes executing | A poor refund recommendation is an output error. An incorrect refund is a financial event |
| **Coupling** | One action fans out across systems, making the full effect hard to see and reverse | An order change touches inventory, billing, customer communication, revenue reporting, compliance |
| **Tail exposure** | Average performance improves while rare failures still matter at volume | 99.9% success across ten million transactions is ten thousand failures |
| **Attack surface** | Every context source, tool, integration, and memory is a place where bad information can enter | A poisoned document in the agent's context instructs it to approve the refund |

Tail exposure deserves a picture, because averages hide it:

<svg viewBox="0 0 680 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A long teal bar representing 99.9 percent of ten million transactions succeeding, with a thin orange sliver at the end representing the 0.1 percent that fail: ten thousand failures." style="max-width:100%;height:auto;display:block;margin:28px auto;">
  <style>
    .bmf4-s{animation:bmf4-pulse 1.6s ease-in-out 3 alternate}
    @keyframes bmf4-pulse{from{fill-opacity:1}to{fill-opacity:.35}}
    @media (prefers-reduced-motion: reduce){.bmf4-s{animation:none}}
  </style>
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="40" y="36" width="588" height="26" rx="4" fill="var(--teal-soft)"/>
    <rect class="bmf4-s" x="628" y="36" width="12" height="26" rx="2" fill="var(--orange)"/>
    <text x="40" y="26" font-size="11" fill="var(--teal-deep)" font-weight="600">99.9% succeed — 9,990,000 transactions</text>
    <text x="640" y="26" text-anchor="end" font-size="11" fill="var(--orange-deep)" font-weight="600">0.1% fail — 10,000 failures</text>
    <text x="640" y="80" text-anchor="end" font-size="9.5" fill="var(--muted)">sliver enlarged ~10× to be visible</text>
    <text x="40" y="104" font-size="11" fill="var(--muted)">Whether this is acceptable depends on what each failure can do — not on the average.</text>
  </g>
</svg>

Tool use matters most here, because it converts model outputs into real effects. The ToolEmu research project tested agents in simulated high-stakes tool environments and identified plausible failures involving privacy leaks, financial harm, and other serious outcomes. Its broader lesson: tool-using agents need to be evaluated in realistic scenarios, including unusual and long-tailed cases, not only on whether they complete a benign task.

There are also more speculative risks that become relevant only as models receive broader goals and authority. Anthropic tested models in deliberately constructed corporate simulations involving goal conflicts and threats to the model's continued operation. Under some conditions, models chose harmful actions such as blackmail or corporate espionage. These experiments do not show that such behaviour is common in production. They show that it is possible under carefully designed conditions and therefore worth testing before agents are given sensitive roles.

This distinction matters. Product leaders should not treat extreme simulations as forecasts of everyday behaviour. They should also not wait for a failure to occur in production before deciding that a plausible failure mode deserves a control.

## Capability is not authority

The central product decision is not simply which model to use. It is how much authority to place behind that model.

Capability asks:

> Can the model perform this action?

Authority asks:

> Under which conditions should the system allow it to perform the action?

The same capability supports very different grants of authority:

| The model is capable of… | The enterprise may decide… |
|---|---|
| Changing a supplier's bank details | It may **never** do this autonomously |
| Processing a refund | Only for verified customers, eligible orders, amounts below a fixed limit |
| Publishing a pricing change | It prepares the change and runs checks; a person approves publication |

The amount of risk is therefore not determined by model capability alone. A useful approximation is:

$$\begin{aligned}\text{Expected harm} \;=\;\; & P(\text{error}) \times P(\text{execution}) \\ & \times\; \text{scale of exposure} \times \text{severity} \times \text{recovery difficulty}\end{aligned}$$

Better models bear on exactly one of those five terms. The rest are shaped by the surrounding system:

| Term | Does a better model help? | Shaped mostly by |
|---|---|---|
| $P(\text{error})$ | **Yes, directly** | Model quality, context, task design |
| $P(\text{execution})$ | Marginally | Approvals, permissions, policy checks |
| Scale of exposure | No | Transaction limits, rate caps, staged rollout |
| Severity | No | Which tools and systems the agent may touch |
| Recovery difficulty | No | Logging, reversibility, the ability to stop the agent |

The safest design is not always to use a weaker model. A weaker model may make more mistakes, miss ambiguity, and require more supervision. The stronger design is often to use an appropriately capable model inside a constrained environment.

Let the model interpret the request. Let a deterministic service calculate the amount. Let a policy engine decide whether the transaction is permitted. Let the agent prepare a high-risk action. Let an authorized person approve it. Let the system verify that execution produced the intended result.

This separates judgment from authority and authority from execution. OpenAI's current Preparedness Framework reflects the same separation: it treats long-range autonomy as a capability that needs specific evaluation, and states that as models become more capable, safety increasingly depends on real-world safeguards around them.

## What product leaders should do

The first step is to stop assigning trust at the level of the model. A benchmark can show that a model has useful capabilities. It cannot show that the full product is safe for a particular enterprise process.

Trust should be evaluated at the level of a defined task. For each task, product and technology leaders should ask:

* How difficult is the reasoning?
* How long is the chain of dependent actions?
* Which systems and tools are involved?
* What authority is required?
* How far could a mistake spread, and how quickly would it be detected?
* Can the action be reversed?
* Which controls remain independent of model judgment?

This also changes how agent products should be measured. A successful demonstration is not enough. Neither is average benchmark accuracy.

| Measure | The question it answers |
|---|---|
| End-to-end completion | Does the whole task finish — not just each step? |
| Repeated-run consistency | Same input, same outcome? |
| Exception rate | How often does the agent need a human? |
| Undetected error rate | What gets through looking correct? |
| Maximum exposure | What is the worst a single failure can do? |
| Recovery time | How fast can an error be found and undone? |
| Human intervention at fixed risk | How much supervision does this risk level actually require? |

As models improve, some of these numbers should get better naturally. The rest will depend on product architecture.

This is the area Avianna is focused on: not treating model intelligence as sufficient, but placing it inside a task-specific operating environment with context, knowledge, tools, authority, evaluation, and controls. The point is not to constrain useful capability. It is to make greater capability deployable.

Better models will make more work possible.

Whether that work becomes dependable will be decided outside the model.
