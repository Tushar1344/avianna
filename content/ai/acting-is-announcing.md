ok so here's a thing that took me way too long to find obvious.

you're watching someone play chess. ten moves in, you know what they're going for. they didn't tell you. they'd never tell you. telling you is the one thing they're actively trying not to do. but it doesn't matter. because *doing* the thing leaks the thing. every move burns a little distance off some goal and piles it onto others. you just watch which distances shrink. the plan falls out.

and this goes way past chess. any agent, any environment, chasing any goal even a little bit efficiently, is screaming what it wants through its actions. there's a whole tiny literature on this, and it's split down the middle in a funny way: half of it is people trying to make the leak *louder* (robots that want you to read them), and half is people trying to plug it (autonomy, security, poker, war). below is the picture and the four or five actual tricks for hiding what you're doing while, annoyingly, still doing it.

> the signal is the shadow of competence. acting on a preference is basically the same operation as announcing it.

## what the watcher sees

put yourself on the other side of the glass. you see the world, you see the agent, you don't see the wanting. all you've got is a short list of maybe-goals (call it three) and a hunch about how smart the thing is. every action tightens the list.

the mechanism is dumb, which is why it works. for each candidate goal you ask one question: *if that were the real goal, how likely was the move i just watched?* an agent that's even roughly rational picks cheap actions more often, so a move that closes in on goal A is evidence for A, and a move that wanders is evidence against. multiply down the whole trajectory and that's your posterior. the whole field is built on that one trick.

go poke it. the dot is the agent. pick one of the three goals in your head, walk to it, and watch the belief panel call you out in real time.

<div class="embed">
  <iframe class="embed-frame" src="sims/visible-pursuit/goal-inference.html" title="Interactive: an observer inferring an agent's goal from its trajectory" loading="lazy" scrolling="no"></iframe>
</div>

run it a few times and the lesson lands: a straight line is a confession. and here's the part that gets you: almost every *other* path is also a confession, just a slower one. the trajectories that keep all three bars near 33% barely exist, and the ones that do are long and stupid. you have to work to stay unreadable, and it costs you.

## the leak, in code

kill the grid and the whole thing is like fifteen lines. watcher holds a belief over goals, watches you move, reweights:

```python
belief = prior.copy()                 # e.g. {A: 1/3, B: 1/3, C: 1/3}

for step in trajectory:
    for g in goals:
        belief[g] *= likelihood(step, g)   # cheap move toward g -> big number
    normalize(belief)                       # sum back to 1
```

there's no neural net in there and nothing clever. `likelihood(step, g)` is high when the step is what an agent chasing `g` would probably do, and low otherwise. run the loop, and after a handful of steps one entry in `belief` eats all the mass. the true goal, usually.

the only number worth naming is the *leak rate*: how far your trajectory drags the belief off the prior, averaged over runs. zero means watching you teaches nothing. high means every step collapses the guess. and here's the brutal part the legibility people already know: **being good at your goal is loud.** shortest paths, greedy grabs, least action: every one of them shovels weight straight onto the truth. the leak is just what competence *looks like* from outside.

## five ways to hide

every one of these is the same knob under a different name. none of them hit zero while still letting you chase anything. all of them buy silence with some currency: time, money, optionality, or the patience of a watcher who's paying more attention than you'd like.

1. **randomize.** add noise. pay reward, buy entropy in your actions. you're optimizing `reward - λ*leak`. one dial, two ends: crank λ to zero and you're fully optimal and fully readable, crank it up and you're anonymous and useless. everything below is a fancy way of turning that dial.

2. **lie with your path.** look like you're going somewhere else, as long as you can stand it, then commit and sprint home. keep the watcher's belief in your *real* goal low right up to the "last deceptive point" (the last step where they can still guess wrong), then take the optimal path from there. that's Masters & Sardiña, and it's clean.

3. **stay ambiguous.** don't fake one decoy. look like *several things at once.* keep at least a couple goals alive at every single step. you never lie. you just refuse to answer.

4. **keep your options.** hold multiple goals reachable for cheap. commit late, stay flexible, let the watcher's prior do the work. this is the empowerment move.

5. **hide in the noise.** make your policy look as close as possible to some boring, expected reference behavior. now your trajectory gets explained away by mundane priors. the watcher doesn't infer the wrong goal, they don't infer a goal at all. steganography, basically.

second sim runs three of these against one world: optimal, legible, deceptive. same start, same true goal, same watcher. watch the accent curve. that's the watcher's belief you're going where you're actually going.

<div class="embed">
  <iframe class="embed-frame" src="sims/visible-pursuit/strategy-demo.html" title="Interactive: three policies — optimal, legible, deceptive — and the observer's belief over time" loading="lazy" scrolling="no"></iframe>
</div>

look at the asymmetry. legible pins you instantly, which is exactly what you want if you're a robot arm reaching for a mug in a kitchen full of nervous humans; be loud, be readable, don't get anybody hurt. deceptive holds the watcher under fifty percent for the whole first half, and pays for it with a couple extra moves and a much dumber-looking commitment. optimal just sits in the middle leaking by accident, not even trying.

## the floor

all of this is haggling with the same three-cornered deal: *competence* (return you actually bank), *concealment* (how little you cough up), *efficiency* (extra time and cost the hiding eats). the corners are real. lunge at one and you pay in the other two. that's the geometry, and there's no trick around it.

and the floor is hard. driving the leak to *exactly* zero means your actions can't depend on your goal at all, which means you can't prefer anything, which means you didn't hide the pursuit, you deleted it. anything above the floor is only ever a question of *against whom.* concealment is defined relative to one specific watcher, one prior, one fixed budget of compute. beat that guy and a sharper one still reads you like a billboard.

> you can hide from a watcher. you can't hide from inference.

which is a weirdly clean place to end up. acting on a preference is, in the limit, the same move as announcing it. so the question was never "how do i act without leaking". there is no such policy, stop looking for it. the question is *which leaks am i willing to pay for, against which audience, for how much return.* pick your leaks.

## further reading

1. Keren, Gal, Karpas. *Goal Recognition Design.* ICAPS 2014. the watcher's side: building worlds that force agents to snitch on themselves.
2. Masters & Sardiña. *Deceptive Path-Planning.* IJCAI 2017. the agent's side. "last deceptive point" + an objective that isn't hand-wavy.
3. Dragan, Lee, Srinivasa. *Legibility and Predictability of Robot Motion.* HRI 2013. the flip: move so a human reads you *faster.*
4. Ramírez & Geffner. *Probabilistic Plan Recognition Using Off-the-Shelf Classical Planners.* AAAI 2010. the Bayesian model the sims up top actually run.
5. Crawford & Sobel. *Strategic Information Transmission.* Econometrica 1982. the signalling-game bedrock under all of it.
