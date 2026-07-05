In 2025, 42 percent of enterprises abandoned most of their AI initiatives before they reached production. A year earlier that figure was 17 percent. The average organization scrapped nearly half of its proofs-of-concept. Those numbers come from S&P Global's survey of just over a thousand enterprises in North America and Europe [[1]](#sources), and they describe the same twelve months in which model capability, on any benchmark you care to pick, improved dramatically.

That combination should bother you more than either fact alone. The models got better. The outcomes got worse. Whatever is killing these projects, it is not the model.

We spent the last month tracing this gap through every primary source we could verify: two large industry surveys, three academic research programs, and the analyst record. This essay is the executive summary of what survived scrutiny, with the caveats stated plainly at the end.

## The numbers

Adoption is nearly universal and value is not. As of McKinsey's late-2025 survey of 1,993 organizations, 88 percent use AI in at least one business function, yet about two-thirds have not begun scaling it across the enterprise. Only 39 percent attribute any effect on earnings to AI at all, and for most of those the effect is under five percent of EBIT. Roughly six percent qualify as what the survey calls high performers [[2]](#sources).

You may have seen a more dramatic number making the rounds: the claim that 95 percent of AI pilots fail, from an MIT Media Lab preprint. We do not lean on it. The sample was small and non-random, the report is contested, and the sturdier surveys tell the same story without the fragility. The pattern does not need exaggerating.

Agents make the pattern sharper. By mid-2025, 62 percent of organizations were at least experimenting with AI agents. No more than 10 percent reported scaling them in any single business function [[2]](#sources). Broad experimentation, shallow deployment. Something between the pilot and production is filtering almost everything out.

## What fails, and what doesn't

The S&P survey asked which factors correlate with project failure. The revealing result is what does not: time-to-deliver shows no correlation. Projects are not dying because engineering is slow.

What does correlate: concern about reputational damage (+77 percent relative to successful projects), customer resistance (+41 percent), and staff resistance (+36 percent) [[1]](#sources). Every one of those is an organizational-absorption factor. The failure surface is trust, incentives, and workflow, and it sits almost entirely outside the codebase.

## What the six percent do differently

Three independent research programs, using different methods, converge on one answer.

McKinsey ran a relative-weights analysis across 31 variables to find what actually predicts impact. Intentional workflow redesign came out among the strongest predictors, and high performers were about three times more likely to have fundamentally redesigned workflows around AI rather than bolting AI onto existing ones [[2]](#sources).

Stanford's Digital Economy Lab studied 51 successful deployments across 41 organizations and put the conclusion in one sentence: "The difference was never the AI model. It was always the organization." Identical technology on identical use cases produced timelines ranging from weeks to years, depending on the organization deploying it [[3]](#sources).

MIT's Center for Information Systems Research finds the same shape in performance terms. Firms at the lowest AI-maturity stage underperform their industry average on growth by 26.5 percentage points; firms at the highest stage outperform by 13.9. The differentiator in their model is what they call synchronization: redesigning work around AI and reskilling the roles and teams it touches [[4]](#sources).

The absorption work, in other words, is not the overhead of an AI initiative. It is the initiative.

## Why nobody tells you this

If the evidence is this consistent, why does the advice you receive keep pointing at models, platforms, and programs? Look at who can afford to say what.

| Who advises you | What they sell | What their model makes it hard to say |
|---|---|---|
| Frontier AI labs | Capability | "The model is not your bottleneck" |
| Cloud and data platforms | Consumption | "Redesign the workflow before you scale the spend" |
| Consultancies | Transformation programs | "Your organization cannot absorb this yet" |
| Vendors at large | Agentic products | "This use case does not need an agent" |

That last row is not hypothetical. Gartner assessed the agentic vendor landscape in June 2025 and estimated that of the thousands of vendors describing their products as agentic, only about 130 were real, a pattern it named agent washing and reaffirmed in 2026 [[5]](#sources). A market this willing to relabel its inventory is not going to volunteer that your bottleneck is organizational.

None of this is conspiracy. It is ordinary incentive structure. The academics and analysts who do publish the absorption finding have their own limits: their access is surveys and interviews rather than instrumented deployments, so the field produces correlations and maturity models rather than causal answers. The question an executive actually needs answered, which is why identical technology succeeds in one organization and dies in the next, remains open. It is the question our research agenda is built around.

## What to ask before the next pilot

The evidence suggests the fate of a pilot is mostly decided by conditions that exist before it starts. Five questions that surface them:

1. **What changes about the workflow if this works?** If the honest answer is nothing, you are commissioning a demo, and demos do not survive contact with the 42 percent filter.
2. **Who owns the outcome?** A named person accountable for the business result, distinct from whoever owns the model's accuracy.
3. **What does the affected team lose?** Staff resistance is one of the strongest failure correlates in the data. If the answer is unexamined, the resistance will examine it for you.
4. **How does it earn more autonomy?** A pilot that cannot articulate its own graduation path, from recommending to acting under supervision to acting within guardrails, will stall at the recommendation stage indefinitely.
5. **What would make you kill it?** Deciding the abandonment criteria up front is cheaper than becoming a 42 percent statistic eighteen months later.

If your portfolio is already stalled between competing priorities, this is the layer we study and the work we do with executive teams. For advisory or collaboration inquiries, [contact the lab](mailto:tushar.madaan@gmail.com?subject=Advisory%20inquiry).

## Caveats

Every figure above is survey data: self-reported, correlational, and in some designs sampled on success. Model capability was never a controlled variable in any of these studies, so "it is not the model" is a consistent inference across independent methods, not an experimental result. The Stanford study examined only successful deployments; MIT CISR publishes consortium briefings rather than peer-reviewed research; the agent figures were fielded in mid-2025 and the market is moving quickly. We cite what each source can actually support and no more.

## Sources

1. S&P Global Market Intelligence / 451 Research, [Voice of the Enterprise: AI & Machine Learning, Use Cases 2025](https://www.spglobal.com/market-intelligence/en/news-insights/research/2025/10/generative-ai-shows-rapid-growth-but-yields-mixed-results), October 2025. n=1,006, North America and Europe.
2. McKinsey & Company, [The State of AI](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai), November 2025. n=1,993, fielded June–July 2025. Stanford's [AI Index 2026](https://hai.stanford.edu/ai-index/2026-ai-index-report/economy) reports the same agent figures from the same underlying survey.
3. Pereira, Graylin, and Brynjolfsson, [The Enterprise AI Playbook](https://digitaleconomy.stanford.edu/publication/enterprise-ai-playbook/), Stanford Digital Economy Lab, April 2026. 51 deployments, 41 organizations, success-sampled.
4. Woerner, Sebastian, Weill, and Kaganer, [Enterprise AI Maturity Update](https://cisr.mit.edu/publication/2025_0801_EnterpriseAIMaturityUpdate_WoernerSebastianWeillKaganer), MIT CISR Research Briefing, August 2025. Correlational; 2022 base survey updated 2025.
5. Gartner, [press release on agentic AI project cancellations and "agent washing"](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), June 2025. Vendor count is an analyst estimate with undisclosed methodology.
