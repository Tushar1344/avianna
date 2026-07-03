**Onboarding digital labor is the hardest challenge the enterprise faces in the agent era.** Without a way to do it, every company is forced into a lose-lose choice: **unleash** agents and absorb the damage — brand harm, AI slop, work no one can trust — or **hold them back** and forfeit the productivity. Onboarding done right is the only way to get the upside without the blast radius.

Why is it so hard? Because a prompt configures a model — it does not onboard a worker. When a human joins a team, they inherit far more than instructions: a role, the context behind it, a mental map of the business, permissions, tools, the policies that bound their judgment, a manager who reviews their work, and an accountable place in the org chart. Agents arrive with none of this. We hand them a prompt and an API key, then act surprised when they behave like contractors who started an hour ago and already have the keys to production. **Digital labor cannot be onboarded with prompts alone.**

Lattice is the enterprise control plane for digital labor. It gives agents business context, models the business through an ontology, governs what agents can see and do, scores their performance, and graduates them into higher-trust work over time.

This note explains the layer Lattice owns, the primitives it uses, and how an agent moves from *observing* to *acting autonomously* without the enterprise losing the thread of who is accountable.

---

## 1. What changed

For decades, the unit of work was a human running a workflow. The software was passive; the person carried everything it could not encode.

A human did four things no system wrote down:

- **Carried context.** Which customer was about to churn, and why the last ticket mattered.
- **Exercised judgment.** When "the policy says yes" still meant "ask first."
- **Knew the escalation path.** Whose desk a hard case landed on.
- **Were accountable.** A name was attached to the outcome.

The shift now underway is from human-run workflows to **human-agent workflows**. Agents can read, reason, and act — but they only inherit what is made explicit. The context that lived in a person's head, the judgment encoded in years of "we don't do it that way," the escalation path that was tribal knowledge — all of it has to be written down, modeled, and enforced. Otherwise the agent operates with the confidence of a senior employee and the context of a stranger. Unlike a broken integration, it does not fail cleanly; it improvises, and the guess looks exactly like competence right up until it is wrong about something that mattered.

That gap — between what agents can do and what they actually understand — is the problem Lattice exists to close.

---

## 2. The problem: enterprises are not agent-ready

The blocker is not model capability. It is that most of what an agent needs to know was never written down. The systems of record — CRM, ERP, ticketing, billing — hold only a fraction of it. The rest is **dark context**: the decisions, exceptions, and judgment that live where no system can see them.

Dark context lives in:

- DMs and group chats
- Personal and shared Google Drives
- In-person meetings and hallway conversations
- Phone calls
- Offsites and whiteboards
- All-hands announcements
- And, most of all, in people's heads

The cruel part is that the most decision-relevant context is the least captured. The pricing exception agreed on a call, the "never auto-close this account" said at an offsite, the reorg announced at all-hands — none of it is in any database the agent can query. A human absorbs it by osmosis over months; an agent sees only the lit fraction and acts, confidently, as if that were the whole picture.

And traditional access control does nothing to help. IAM answers *can this identity read this row?* It was never designed to answer the questions agents raise: *Should this agent take this action, on this object, in this state, given this policy, and who answers for it if it's wrong?*

The mismatch is structural. Access control is binary and static — a permission is granted or it is not, and it stays that way until someone changes it. Agent authority needs to be conditional and dynamic: allowed *here*, in *this* state, up to *this* threshold, and only while the agent's track record holds. The same refund might be fine on a routine account and require sign-off on a strategic one; the same agent might be trusted with it on Tuesday and pulled back after a bad week. None of that fits in an access-control list.

Granting an agent database access is not onboarding. It is the equivalent of giving a new hire a master keycard and no manager.

---

## 3. The primitive model

Lattice onboards digital labor through a chain of primitives. Skip a link and the agent runs with a blind spot.

```
Role → Context → Ontology → Permissions → Tools → Policy → Evaluation → Graduation → Accountability
```

| Primitive | The question it answers |
|---|---|
| **Role** | What job is this agent here to do? |
| **Context** | What does it need to know to do that job? |
| **Ontology** | What do the things it works with *mean*? |
| **Permissions** | What is it allowed to see? |
| **Tools** | What is it allowed to use? |
| **Policy** | What requires approval, and what is forbidden? |
| **Evaluation** | How well is it actually doing? |
| **Graduation** | Has it earned more trust? |
| **Accountability** | Who answers for the outcome? |

Three primitives carry most of the weight — context, ontology, and the control plane — and three processes keep the agent honest over time: evaluation, graduation, and accountability.

---

## 4. What Lattice is

Lattice is the onboarding and control layer for digital labor. It is easiest to define by what it is *not*:

| Lattice is not… | Because that only gives you… |
|---|---|
| an agent registry | a list of agents, not their authority or fitness |
| IAM | row-level access, not action-level judgment |
| workflow automation | execution, not meaning or accountability |
| observability | a record of what happened, not control over what happens next |

Each of those is necessary. None is sufficient. **Lattice connects all of them around two things they individually ignore: what the business *means*, and who is *accountable*.** A registry plus IAM plus a workflow engine plus a dashboard still leaves the central question unanswered — is this agent ready to do this, and who owns it if it isn't?

Lattice does not replace these systems; it sits above them and gives them a shared frame. It reads identity from IAM, executes through the agent frameworks and workflow engines already in place, and consumes the traces observability emits. What it adds is the binding none of them own: an agent to a role, a role to context and ontology, an ontology to policy, and policy to an accountable human — plus the evaluation loop that tightens or loosens that binding over time. Everything below answers *what happened* or *what is technically allowed*; Lattice answers *what should happen next, and who stands behind it.*

---

## 5. Why context matters

**Context tells agents what matters.**

Raw data access is not context. An agent can query every table and still not know what it is looking at — context is what turns rows into situations.

An agent doing real work needs to understand:

- **Business objects** — what a customer, contract, ticket, or opportunity actually is
- **States** — open vs. escalated, trial vs. paid, at-risk vs. healthy
- **Relationships** — which account this ticket belongs to, which contract sets its SLA
- **Ownership** — who is responsible for this object and its outcome
- **Policies and constraints** — what the rules say about this kind of case
- **Decisions and risks** — what has already been decided, and what could go wrong
- **Outputs and escalation rules** — what a good result looks like, and when to hand off

Without this, an agent treats a "Sev-1 from your largest account" the same as a routine question, because both are just rows. Context is what makes those two rows different.

Context is also what separates an agent that is technically correct from one that is *useful*. Raw access answers "what is the status of this account?" with the literal field value. Context answers the question behind it — *is this account at risk, why, and what should happen next?* The first is a lookup; the second is the work. Lattice treats context as a curated, versioned, per-role asset, not something the agent rebuilds from scratch on every task.

And the first job of Grounding is to **capture dark context** — to pull the decisions and exceptions out of DMs, Drives, calls, offsites, and all-hands, and turn them into something an agent can actually consult. The lit fraction in the systems of record is the easy part; the work is surfacing the rest before an agent acts without it.

---

## 6. Why ontology matters

**Ontology tells agents what things mean.**

If context is the situation, ontology is the map: a model of the business — customers, accounts, contracts, tickets, opportunities, workflows, approvals, policies, decisions, agents, humans, and outputs — and how they connect.

A working ontology tells an agent four things about every object:

1. **What it is** — the type and its meaning in the business
2. **What state it is in** — and which transitions are legal from here
3. **What actions are valid** — what may be done to it, by whom, under what conditions
4. **Who owns the outcome** — the accountable human or team

This is deliberately not academic ontology. It is not a debate about whether a contract *is-a* agreement. It is an operational map: *this is a contract, it is in renewal, you may draft a summary but not send a notice, and the account owner signs off.* The agent never has to guess what an object means or what it may do with it.

The ontology is also what makes the rest of Lattice enforceable: permissions, policies, and the graduation ladder all attach to ontology objects and states. "Issue a credit over \$X requires approval" is only meaningful if the system knows what a *credit* is, which *account* it touches, and what *state* that account is in. Without a shared model, every policy collapses into a brittle string match against raw data. With one, policy becomes a statement about the business — *agents may not send renewal notices on contracts in dispute* — that holds no matter which system the underlying data lives in. The ontology is the vocabulary; every policy is a sentence written in it.

---

## 7. Why a control plane matters

**The control plane tells agents what they can do.**

Context and ontology give the agent understanding. The control plane gives the enterprise control. It governs:

- **Which agents exist** and what role each performs
- **What tools** each may use
- **What data** each may access
- **What actions** each may take
- **What requires approval** before it executes
- **How activity is logged** — every action, with its justification
- **Who is accountable** for each agent's behavior

The control plane is where understanding meets authority. An agent may *understand* that a refund would resolve a ticket and still be barred from issuing one above a threshold without sign-off. That gap — between what an agent could do and what it is permitted to do — is the surface the control plane governs: the difference between an agent that reasons and an agent allowed to act on its reasoning.

Crucially, the control plane is a chokepoint, not a guideline. An agent does not "try to follow" the rules: its actions pass through Lattice, anything outside its granted authority does not execute, approvals hold until a human clears them, and logging happens at the point of action. Policy is enforced by construction, not by good intentions.

---

## 8. Agent graduation

**Agents earn trust over time.**

No one gives a new hire signing authority on day one; they watch, then suggest, then act under supervision, then act on their own. Agents should earn authority the same way. Lattice defines a graduation ladder, and an agent occupies exactly one rung per role.

| Level | Name | What the agent may do |
|---|---|---|
| **0** | Observe | Read context. Produce no output that touches the business. |
| **1** | Recommend | Suggest actions to a human. The human decides. |
| **2** | Draft | Prepare the artifact (reply, ticket update, summary). A human sends it. |
| **3** | Act with approval | Execute, but only after explicit human approval per action. |
| **4** | Act within guardrails | Execute autonomously inside hard limits; anything outside escalates. |
| **5** | Act autonomously in bounded domains | Operate independently within a well-defined scope, with audit and override intact. |

The ladder is per-role, not per-agent. The same agent might sit at Level 4 for ticket triage and Level 1 for issuing credits. Trust is scoped to a domain, never granted globally.

---

## 9. The agent scorecard

You cannot graduate what you do not measure — and model accuracy is the wrong measure. An agent can be 95% accurate and still be untrustworthy if its 5% of errors all land on high-risk actions, or if it never escalates when it should. Lattice scores agents on **business trust**, across dimensions a model benchmark ignores:

| Dimension | What it measures |
|---|---|
| **Task accuracy** | Did it get the work right? |
| **Policy compliance** | Did it stay inside the rules? |
| **Context use** | Did it use the context available, or act blind? |
| **Escalation judgment** | Did it hand off the cases it should have? |
| **Human override rate** | How often do humans correct or reverse it? |
| **Business outcome quality** | Did the result actually serve the business? |
| **Risk handling** | How did it behave on high-stakes actions? |
| **Audit completeness** | Is every action traceable and justified? |
| **Stability** | Is its behavior consistent over time? |

An agent that confidently handles the easy 90% but cannot recognize the dangerous 10% is not ready, regardless of its accuracy score. The weighting also shifts with the level: at Level 1, task accuracy dominates, because the agent is only making suggestions. At Level 4 and above, escalation judgment, risk handling, and audit completeness dominate, because the failure that matters is no longer "wrong answer" but "wrong action, taken alone, that no one caught in time." The scorecard is not a single number; it is the evidence file the graduation gates read from — and the same file consulted when something goes wrong and someone asks how the agent was allowed to do that.

---

## 10. Graduation gates

**Graduation tells the enterprise when agents are ready for higher-stakes work.**

An agent moves up a level only when it clears explicit thresholds — conditions checked against the scorecard, not a judgment call:

- **No critical policy violations** in the evaluation window
- **Override rate below threshold** for the target level
- **Strong escalation judgment** — it hands off the right cases
- **Complete audit trail** — every action is logged and justified
- **Good outcome quality** — results hold up to review
- **Explicit sign-off** from the business owner or risk owner

The last gate keeps a human in the loop on the *promotion*, even as the agent grows autonomous in the *work*. An agent never promotes itself.

---

## 11. Regression and demotion

Graduation runs both ways. Trust that can only increase is not trust; it is drift. If an agent's behavior degrades — a drop in scorecard performance, a policy violation, a spike in override rate, a rise in surrounding risk — Lattice can pull it back. The responses escalate with the severity:

- **Reduce scope** — narrow the domains it operates in
- **Require human approval** — drop it from guardrails back to per-action sign-off
- **Remove tools** — revoke a capability that is being misused
- **Pause execution** — freeze the agent pending review
- **Move it down a level** — formal demotion on the ladder

Demotion is not a failure of the system; it is the system working. The machinery that earns trust is the machinery that revokes it.

---

## 12. Concrete example: a support triage agent

A support triage agent reads inbound tickets, gathers context, and resolves or routes them. Here is what Lattice wraps around it.

**Context it receives**

- **Customer context** — who they are, tier, account health, recent history
- **Contract / SLA context** — entitlements and the response clock running on this ticket
- **Ticket state** — new, in progress, escalated, or awaiting customer

**Ontology it operates in**

- A *ticket* belongs to an *account*, which holds a *contract*, which sets an *SLA*.
- A ticket in `escalated` allows different actions than one that is `new`.

**Actions and approvals**

| Action | Authority at Level 4 (within guardrails) |
|---|---|
| Categorize and tag the ticket | Autonomous |
| Reply with a known-good answer | Autonomous |
| Route to a specialist queue | Autonomous |
| Issue a credit under \$X | Autonomous |
| Issue a credit over \$X | Requires human approval |
| Touch a top-tier account's Sev-1 | Escalate to a human |

**Accountability**

Every action is logged with the context the agent saw and the reason it acted. The support lead is the named owner — so if the agent mishandles a case, there is a trail to review and a person who answers for it.

**A trace, end to end**

Put it in motion. A ticket arrives: *"Still seeing 500s after the maintenance window."*

1. **Resolve context.** Lattice hands the agent the account (top-tier), the contract (a 1-hour Sev-1 SLA, 40 minutes left), and the ticket state (`new`).
2. **Classify.** The agent tags it `incident / availability`, Sev-1. Within authority — it acts.
3. **Propose an action.** Its draft reply offers a \$2,000 credit as goodwill.
4. **Hit a gate.** The credit is over \$X *and* the account is top-tier. Two policies fire; Lattice holds the action and routes it to the support lead with the agent's reasoning attached.
5. **Escalate the rest.** Because this is a top-tier Sev-1, the agent pages on-call rather than attempting a fix it has no tool for.
6. **Log everything.** Context seen, classification, proposed credit, the gate that stopped it, the human who approved, the escalation — all written at the point of action.

Nothing here required the agent to be told "ask before issuing large credits to big accounts." The ontology knew what a credit and a top-tier account were; the control plane knew which actions needed sign-off; the scorecard recorded how well the agent did. The agent reasoned; Lattice decided what that reasoning was allowed to do.

At Level 1, this same agent only *suggests* the category and the reply for a human to approve. The journey from Level 1 to Level 4 is exactly the graduation process — earned against the scorecard, gated by sign-off, reversible if the evidence turns. What changes between levels is not the model, the prompt, or the agent's data access — only its *authority*, the set of actions it may take without a human. Onboarding is not a one-time switch from "off" to "on." It is a dial Lattice turns in either direction as the evidence accumulates.

---

## 13. One-slide summary

> **Digital labor needs onboarding.**
>
> Onboarding requires **context** (what matters), **ontology** (what things mean), **control** (what agents can do), **evaluation** (how they're doing), **graduation** (when they're ready for more), and **accountability** (who answers for the outcome).
>
> **Lattice is the enterprise control plane for digital labor** — the operating layer that provides all six.

| Layer | What it provides |
|---|---|
| Context | What matters |
| Ontology | What things mean |
| Control plane | What agents can do |
| Scorecard | How well they're doing |
| Graduation | When they're ready for more |
| Accountability | Who owns the outcome |

Agents will keep getting more capable, which makes the onboarding layer more important, not less. Capability without context is a liability; capability inside Lattice is digital labor you can actually trust with the next, higher-stakes task — and the one after that.
