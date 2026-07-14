A model that writes a bad answer creates a quality problem.

An agent that can search company records, update a customer account, send an email, or move money can create an operational problem.

This distinction will matter more as AI models improve.

The usual discussion treats capability as a single upward curve. Models become better at reasoning, planning, using tools, and completing longer tasks. The assumption is that better capability will make enterprise AI safer and more reliable.

That is partly true.

More capable models should misunderstand fewer instructions. They should make better plans, select tools more accurately, and recover from simple mistakes. They should need less prompt engineering and less routine correction from people.

But capability also changes the reach of a system. A model that once produced a paragraph can now carry out a sequence of actions. It can work for longer, touch more systems, and affect more people.

Some risks decline. Others grow.

The useful question is not whether better models increase or decrease risk in general. It is how they change the shape of risk.

## Capability increases reach

One way to see this shift is to look at the length of tasks models can complete.

METR measures the duration of software tasks that AI agents can complete with a specified probability of success. Its results show rapid growth in the time horizon of frontier models. Tasks that once exceeded the practical reach of an agent are becoming possible.

This does not mean that an AI agent can now perform every kind of enterprise work for the same length of time. METR has found large differences between domains. In its analysis, visual computer-use task horizons were roughly 40 to 100 times shorter than those for software and reasoning tasks, even though both were improving. Capability remains highly dependent on the nature of the work and the environment in which it is performed.

Still, the direction is clear. Models are becoming able to stay with a problem for longer.

That is valuable. Many enterprise processes are not single questions. They are sequences.

Resolving a customer complaint may require finding the customer, reading the account history, checking the current policy, reviewing previous cases, calculating an amount, updating a system, and communicating the decision.

The longer the sequence a model can manage, the more of the process it can perform.

The same improvement creates a new failure mode.

An error near the beginning of a long workflow can travel.

Suppose an agent incorrectly decides that a customer is eligible for a refund. If the agent only drafts a recommendation, a person may catch the mistake. If it can also select the order, calculate the refund, update the customer record, issue the payment, and send a confirmation, the original mistake becomes embedded across several systems.

The model has not necessarily become less reliable. It has become more consequential.

Long workflows also create opportunities for small errors to accumulate or for an occasional large error to appear.

A recent preprint from Microsoft Research examined delegated document-editing workflows across 52 professional domains and 19 models. The researchers found that even the frontier models they tested degraded an average of 25 percent of document content by the end of long workflows. The errors were not always a steady stream of small mistakes. They were often sparse but severe, and worsened with larger documents, longer interactions, and distracting files. Tool use did not solve the problem in that evaluation.

The study is one benchmark, not a universal measure of enterprise agents. But it illustrates an important pattern: success on individual steps does not guarantee that the full artifact or process remains intact over time.

A model can look competent at every turn while the overall result slowly drifts.

## The risks that decline

Several risks should fall as models improve.

The first is simple misunderstanding. Better models are more likely to identify what a person is trying to achieve, even when the instruction is incomplete or loosely expressed.

The second is planning failure. A stronger model should be better at breaking work into steps, ordering those steps, and changing course when new information appears.

The third is basic tool selection. Models should become better at recognizing when they need to search, retrieve a record, run code, perform a calculation, or ask for human judgment.

The fourth is brittle instruction following. Product teams should need fewer elaborate prompt rules to make a model produce a valid structure or follow a routine process.

The fifth is routine human correction. People should spend less time fixing wording, supplying obvious information, or correcting straightforward reasoning.

These are meaningful gains. They will make more enterprise tasks economically viable.

More capable models may also reduce risk directly. A strong model may notice that information is missing, identify a contradiction between two policies, question an unusual transaction, or recognize that an action exceeds its authority.

So the argument is not that stronger models are inherently less safe.

The argument is that model quality addresses only part of the risk.

## The risks that grow

The first growing risk is **reach**.

A capable agent can continue acting after an early mistake. It can cross several applications and leave behind a trail of individually valid actions built on an invalid premise.

The second is **velocity**.

A person can make one incorrect change at a time. An agent may repeat the same error across thousands of customers, products, or records before anyone notices the pattern.

The third is **authority**.

The consequences of a mistake change when a model moves from recommending an action to executing it.

A poor refund recommendation is an output error. An incorrect refund is a financial event.

An inaccurate pricing draft is a content problem. Publishing the price can create customer expectations, contractual disputes, and lost revenue.

The fourth is **coupling**.

Enterprise actions rarely remain in one system. A change to an order may affect inventory, billing, customer communication, revenue reporting, and compliance records. The more systems an agent can reach, the harder it becomes to understand and reverse the full effect of a mistake.

The fifth is **tail exposure**.

Average performance can improve while rare failures remain important.

A system that succeeds 99.9 percent of the time sounds reliable. At ten million transactions, the remaining 0.1 percent represents ten thousand failures. Whether this is acceptable depends on what each failure can do.

The sixth is **attack surface**.

Every new source of context, external tool, integration, and memory system creates another place where incorrect, malicious, or unauthorized information can influence the agent.

Tool use is especially important because it converts model outputs into real effects.

The ToolEmu research project tested agents in simulated high-stakes tool environments. It identified plausible failures involving privacy leaks, financial harm, and other serious outcomes. Its broader lesson was that tool-using agents need to be evaluated in realistic scenarios, including unusual and long-tailed cases, rather than only on whether they complete a benign task.

There are also more speculative risks that become relevant only as models receive broader goals and authority.

Anthropic tested models in deliberately constructed corporate simulations involving goal conflicts and threats to the model's continued operation. Under some conditions, models chose harmful actions such as blackmail or corporate espionage. These experiments do not show that such behaviour is common in production. They show that it is possible under carefully designed conditions and therefore worth testing before agents are given sensitive roles.

This distinction matters. Product leaders should not treat extreme simulations as forecasts of everyday behaviour. They should also not wait for a failure to occur in production before deciding that a plausible failure mode deserves a control.

## Capability is not authority

The central product decision is not simply which model to use.

It is how much authority to place behind that model.

Capability asks:

> Can the model perform this action?

Authority asks:

> Under which conditions should the system allow it to perform the action?

A model may be capable of changing a supplier's bank details. The enterprise may decide that it should never be allowed to do so autonomously.

A model may be capable of processing a refund. The enterprise may permit it only for verified customers, eligible orders, and amounts below a fixed limit.

A model may be capable of publishing a pricing change. The enterprise may allow it to prepare the change and run checks while requiring a person to approve publication.

The amount of risk is therefore not determined by model capability alone.

A useful approximation is:

$$\begin{aligned}\text{Expected harm} \;=\;\; & P(\text{error}) \times P(\text{execution}) \\ & \times\; \text{scale of exposure} \times \text{severity} \times \text{recovery difficulty}\end{aligned}$$

Better models can reduce the probability of error.

They do not, by themselves, determine whether an error reaches production, how widely it spreads, or how easily it can be reversed.

Those terms are shaped by the surrounding system:

* Which tools are available
* What permissions the agent has
* Which actions require approval
* What transaction limits apply
* Whether the result is independently checked
* Whether the action is logged
* Whether it can be rolled back
* Whether the agent can be stopped

OpenAI's current Preparedness Framework reflects this separation. It treats long-range autonomy as a capability that needs specific evaluation and states that, as models become more capable, safety increasingly depends on real-world safeguards around them.

The safest design is not always to use a weaker model.

A weaker model may make more mistakes, miss ambiguity, and require more supervision.

The stronger design is often to use an appropriately capable model inside a constrained environment.

Let the model interpret the request. Let a deterministic service calculate the amount. Let a policy engine decide whether the transaction is permitted. Let the agent prepare a high-risk action. Let an authorized person approve it. Let the system verify that execution produced the intended result.

This separates judgment from authority and authority from execution.

## What product leaders should do

The first step is to stop assigning trust at the level of the model.

A benchmark can show that a model has useful capabilities. It cannot show that the full product is safe for a particular enterprise process.

Trust should be evaluated at the level of a defined task.

For each task, product and technology leaders should ask:

* How difficult is the reasoning?
* How long is the chain of dependent actions?
* Which systems and tools are involved?
* What authority is required?
* How far could a mistake spread?
* How quickly would the mistake be detected?
* Can the action be reversed?
* Which controls remain independent of model judgment?

This also changes how agent products should be measured.

A successful demonstration is not enough. Neither is average benchmark accuracy.

The relevant measures include end-to-end completion, repeated-run consistency, exception rate, undetected error rate, maximum exposure, recovery time, and the amount of human intervention required at a fixed risk level.

As models improve, some of these numbers should get better naturally.

The rest will depend on product architecture.

This is the area Avianna is focused on: not treating model intelligence as sufficient, but placing it inside a task-specific operating environment with context, knowledge, tools, authority, evaluation, and controls. The point is not to constrain useful capability. It is to make greater capability deployable.

Better models will make more work possible.

Whether that work becomes dependable will be decided outside the model.
