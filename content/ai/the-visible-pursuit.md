Watch a chess player for ten moves and you can usually tell what they're trying to do. Not because they announced anything — they're doing the opposite of announcing — but because *doing* a thing leaks evidence about *wanting* the thing. Every move shaves a little distance off some goal and adds it to others. Stand back, count which distances are shrinking, and the plan tells itself.

This is general. Any agent in any environment that pursues a goal efficiently broadcasts, through its actions alone, a signal about what that goal is. There's a small, beautiful literature on this — split between people who want to *encourage* the leak (robots that should be readable to humans) and people who want to *plug* it (autonomous systems, security, games of imperfect information). What follows is a tour of the basic picture and the four or five real strategies for hiding your intent without giving up on actually doing things.

> The signal is the shadow of competence. Acting on a preference is, mathematically, almost the same as announcing it.

## What the observer sees

Put yourself behind the curtain. You can see the environment, you can see the agent, but you can't see what it wants. You hold a list of possibilities — say, three things it might be after — and a guess about how rational it is. Now every action it takes tightens that list.

The mechanism is almost embarrassingly simple. For each candidate goal, ask: *if this were the real goal, how likely was the move I just saw?* Boltzmann-rational agents take low-cost actions more often, so moves that close in on goal $A$ are evidence for $A$, and moves that don't are evidence against. Multiply across the trajectory and you get a posterior.

Try it. The dot in the middle is the agent. Pick one of the three labelled goals in your head and walk toward it — the observer's belief sits in the panel beside the grid, updating as you go.

<div class="embed">
  <iframe class="embed-frame" src="sims/visible-pursuit/goal-inference.html" title="Interactive: an observer inferring an agent's goal from its trajectory" loading="lazy" scrolling="no"></iframe>
</div>

The takeaway, after a few runs: a straight line is a confession. Most other paths are also confessions, just slower ones. There don't seem to be many trajectories that keep all three bars near 33%, and the few that exist are *long*.

## The math of the leak

Strip away the grid and what's left is information theory. Let $G$ be the random variable for the agent's goal, and $T$ the random variable for the trajectory it generates. The observer starts with a prior $P(g)$ and updates to a posterior by Bayes:

$$
P(g \mid \tau) \;\propto\; P(\tau \mid g)\, P(g).
$$

How much the trajectory *tells* the observer, on average, is the mutual information between goals and trajectories:

$$
I(G; T) \;=\; \mathbb{E}_{g,\tau}\!\left[\, \log \frac{P(g \mid \tau)}{P(g)} \,\right].
$$

When this number is zero, watching the agent teaches you nothing about its goal. When it's high, every action shrinks the hypothesis space sharply. The unfortunate result from the legibility literature is that **optimal goal pursuit is generically information-rich**: shortest paths, greedy resource use, the principle of least action — all of them concentrate the posterior on the truth. The leak is the shadow of competence, not a bug.

## Five ways to hide

Each strategy below is a knob on the same underlying tradeoff. None of them get you to zero leakage while still letting you pursue something. All of them buy concealment with some currency — time, cost, optionality, or the suspicion of a careful observer.

1. **Policy randomization.** Add noise. Trade expected return for entropy in your action distribution. The clean objective is $\max\, \mathbb{E}[R] - \lambda \cdot I(G; T)$ — a rate–distortion frontier with two extremes (full optimality, full anonymity) and a knob you turn between them.

2. **Deceptive planning.** Look like you're going somewhere else for as long as possible, then commit. Formally: keep $P(g_{\text{true}} \mid \tau_{0:t})$ low up to the "last deceptive point" — the last step where the observer can still be wrong — then take the optimal path home. Masters & Sardiña's classic result.

3. **Ambiguity preservation.** Don't try to look like a decoy. Try to look like *several things at once.* Constrain your trajectory so the posterior's support stays broad: at least $k$ goals remain plausible at every step. You're never lying, just refusing to disambiguate.

4. **Option preservation.** Keep multiple goals reachable at bounded extra cost. The empowerment-style approach: commit late, preserve future flexibility, and let the observer's prior do most of the work.

5. **Behavioral steganography.** Minimize the KL divergence between your policy and a benign reference policy $\pi_0$. Your trajectory is explained away by mundane priors. The observer doesn't infer a goal; they don't infer anything at all.

The second simulation runs three of these — optimal, legible, and deceptive — against the same world. Same start, same true goal, same observer. Watch the accent curve: that's the observer's belief that you're heading where you're actually heading.

<div class="embed">
  <iframe class="embed-frame" src="sims/visible-pursuit/strategy-demo.html" title="Interactive: three policies — optimal, legible, deceptive — and the observer's belief over time" loading="lazy" scrolling="no"></iframe>
</div>

Notice the asymmetry. The legible path makes you instantly readable, which is what you want if you're a robot pointing at a coffee cup in a kitchen full of humans. The deceptive path keeps the observer's belief under fifty percent for the entire first half of the trajectory — at the cost of two or three extra moves and a much more convoluted commitment. Optimal sits in the middle, leaking by accident.

## The limit

All of these strategies are negotiating with the same three-cornered tradeoff: *competence* (how much return you actually capture), *concealment* (how little you reveal), and *efficiency* (how much extra time and cost the hiding takes). The corners are real. Any move toward one of them costs you something of the others.

And the floor matters. $I(G; T) = 0$ forces your policy to be statistically independent of your goal, which means it can't preferentially pursue anything — you've eliminated the leak by eliminating the pursuit. Anything short of that is a question of *against whom.* Concealment is always defined relative to a specific observer model, with a specific prior, doing a specific amount of computation. Beat that observer and a more careful one can still see through you.

> You can hide from a particular observer. You can't hide from inference itself.

Which is a strange and clarifying place to land. Acting on a preference is, in the limit, the same thing as announcing one. The interesting question isn't *how do I act without leaking* — there's no such policy. It's *which leaks am I willing to pay for, against which audience, for how much return.*

## Further reading

1. Keren, Gal, Karpas. *Goal Recognition Design.* ICAPS 2014. The observer's-side framing — how to design environments that force agents to reveal themselves.
2. Masters & Sardiña. *Deceptive Path-Planning.* IJCAI 2017. The agent's side. Introduces the "last deceptive point" and a principled objective.
3. Dragan, Lee, Srinivasa. *Legibility and Predictability of Robot Motion.* HRI 2013. The inverse problem — moving so that a human reads your goal faster.
4. Ramírez & Geffner. *Probabilistic Plan Recognition Using Off-the-Shelf Classical Planners.* AAAI 2010. The Bayesian model the simulations above run on.
5. Crawford & Sobel. *Strategic Information Transmission.* Econometrica 1982. The signalling-game foundation for everything in this area.
