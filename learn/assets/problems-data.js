// Generated from leetmath problem bank v2 (data/problem_bank_probability.json).
// 37 problems; module + hardness metadata from docs 05 and 06.
const LM_PROBLEMS = [
 {
  "id": "P0-001",
  "title": "Two Dice, One Universe",
  "level": "Easy",
  "module": "P0",
  "hardness": [
   "H1 sample-space"
  ],
  "tags": [
   "sample_space",
   "uniformity"
  ],
  "statement": "A quant-desk interviewer opens with the oldest screen in the book: two fair dice are rolled. What is the probability the sum is 7?",
  "answer": "1/6",
  "solution": "There are 36 equally likely ordered outcomes. The favorable outcomes are (1,6),(2,5),(3,4),(4,3),(5,2),(6,1), so the probability is 6/36 = 1/6.",
  "autopsy": "The key is that dice outcomes are ordered pairs, not just sums.",
  "wrong": "Counting sums 2 through 12 as equally likely and saying 1/11.",
  "diagnosis": "Non-uniform sample space: sums are not equally likely.",
  "remediation": "List the ordered pairs for sums 2, 7, and 12 and compare their counts.",
  "variant": "The follow-up she actually cares about: what is the probability the sum is at least 10?"
 },
 {
  "id": "P0-002",
  "title": "The Complement Door",
  "level": "Easy",
  "module": "P0",
  "hardness": [
   "H1 sample-space"
  ],
  "tags": [
   "complement",
   "cards"
  ],
  "statement": "Your inbound pipeline holds 52 applications; exactly 4 are from ex-founders. A coordinator pulls 5 at random for today's screening block. What is the probability the block contains at least one ex-founder?",
  "answer": "1 - C(48,5)/C(52,5)",
  "solution": "The complement of “at least one ex-founder” is “none.” There are C(52,5) possible screening blocks and C(48,5) containing no ex-founders, so the probability is 1 - C(48,5)/C(52,5).",
  "autopsy": "When 'at least one' creates many cases, count the complement.",
  "wrong": "Adding the probabilities of exactly 1, 2, 3, and 4 ex-founders — and fumbling a case or a denominator on the way.",
  "diagnosis": "Direct-case explosion. Use complement to avoid fragmented counting.",
  "remediation": "Practice converting 'at least one' into 'not zero'.",
  "variant": "Among 10 server checks, each independently fails with probability p. What is the probability at least one fails?"
 },
 {
  "id": "P1-001",
  "title": "Same Representation Rule",
  "level": "Medium",
  "module": "P1",
  "hardness": [
   "H1 sample-space",
   "H10 representation"
  ],
  "tags": [
   "combinations",
   "cards"
  ],
  "statement": "A 52-person org includes 13 engineers. A 5-person task force is drawn at random. What is the probability it has exactly two engineers?",
  "answer": "C(13,2)C(39,3)/C(52,5)",
  "solution": "Use unordered teams as the sample space. Total task forces: C(52,5). Favorable: choose 2 of the 13 engineers and 3 of the 39 others, giving C(13,2)C(39,3).",
  "autopsy": "Total and favorable outcomes must both be counted as unordered teams.",
  "wrong": "13*12*39*38*37 / (52*51*50*49*48) without correcting order.",
  "diagnosis": "Mixed ordered and unordered counting.",
  "remediation": "Solve once with combinations and once with ordered draws; verify both match after order factors.",
  "variant": "Same numbers, different costume: a 5-card hand from a 52-card deck — probability of exactly two hearts?"
 },
 {
  "id": "P1-002",
  "title": "Birthday Collision",
  "level": "Medium",
  "module": "P1",
  "hardness": [
   "H1 sample-space",
   "H2 conditioning"
  ],
  "tags": [
   "complement",
   "birthday"
  ],
  "statement": "Your 40-person office celebrated two birthdays in the same week and someone called it spooky. Among n colleagues with 365 equally likely birthdays and no leap years, what is the probability at least two share a birthday?",
  "answer": "1 - 365·364·...·(365-n+1)/365^n for n <= 365",
  "solution": "Count the complement: all n birthdays distinct. The first colleague can have any of 365 days, the next 364, and so on; divide by 365^n total assignments. P(collision) = 1 - (365)_n/365^n. At n = 40 this is already about 89% — the office is not spooky.",
  "autopsy": "Collisions are easier by complement because direct pair counts overlap.",
  "wrong": "C(n,2)/365 as the exact answer.",
  "diagnosis": "Union bound used as equality; pair collisions overlap.",
  "remediation": "Compare n=3 and list cases where two pairs share because all three match.",
  "variant": "What is the probability no two of n users receive the same one of m random coupons?"
 },
 {
  "id": "P2-001",
  "title": "The Two-Deal Trap",
  "level": "Hard",
  "module": "P2",
  "hardness": [
   "H2 conditioning",
   "H11 wording"
  ],
  "tags": [
   "conditional_probability",
   "sample_space"
  ],
  "statement": "Two pilot deals ran independently last quarter, each closing with probability 1/2. Your VP heard secondhand only that “at least one closed.” Given exactly that information, what is the probability both closed?",
  "answer": "1/3",
  "solution": "The equally likely outcomes are (miss, miss), (miss, close), (close, miss), (close, close). Conditioning on “at least one closed” removes (miss, miss), leaving three outcomes, of which one is both closing. 1/3.",
  "autopsy": "“At least one” does not point at a specific deal; it filters the original four outcomes.",
  "wrong": "1/2, because the other deal is a coin flip.",
  "diagnosis": "Ambiguous conditioning collapsed two cases into one.",
  "remediation": "Contrast with: “You asked about deal A specifically and heard it closed.” That version gives 1/2 — what was observed, and how, changes the answer.",
  "variant": "The schoolbook original, same trap: a family has two children and at least one is a girl — what is the probability both are girls?"
 },
 {
  "id": "P2-002",
  "title": "Base Rate Interview",
  "level": "Medium",
  "module": "P2",
  "hardness": [
   "H2 conditioning"
  ],
  "tags": [
   "bayes",
   "base_rate"
  ],
  "statement": "A screening test catches 90% of qualified candidates and falsely flags 20% of unqualified candidates as qualified. If 10% of applicants are qualified, what is the probability a flagged candidate is truly qualified?",
  "answer": "1/3",
  "solution": "Out of 1000 applicants, about 100 are qualified and 900 unqualified. The test flags 90 qualified candidates and 180 unqualified candidates. Among 270 flagged candidates, 90 are truly qualified. Probability = 90/270 = 1/3.",
  "autopsy": "Strong signals can still be overwhelmed by base rates.",
  "wrong": "90%, because the test catches 90% of qualified candidates.",
  "diagnosis": "Confusing P(flag|qualified) with P(qualified|flag).",
  "remediation": "Always write the two conditional probabilities in words before computing Bayes.",
  "variant": "A medical test has sensitivity 99%, false positive rate 5%, disease prevalence 1%. Compute P(disease|positive)."
 },
 {
  "id": "P2-003",
  "title": "Monty Opens a Door",
  "level": "Hard",
  "module": "P2",
  "hardness": [
   "H2 conditioning",
   "H11 wording"
  ],
  "tags": [
   "conditional_probability",
   "bayes",
   "games"
  ],
  "statement": "In a three-door game, one car is hidden behind one door. You pick door 1. The host, who knows where the car is, always opens a goat door among the two unpicked doors, choosing randomly if both are goats. The host opens door 3. What is the probability the car is behind door 2?",
  "answer": "2/3",
  "solution": "Name the random variables before touching numbers. Let C be the door hiding the car (uniform on 1, 2, 3) and H the door the host opens. You picked door 1 and observed H = 3. The evidence is not “door 3 has a goat” — it is “the host, following his rule, chose door 3.” So model the rule: if C = 1, both unpicked doors hide goats and he flips a coin, P(H=3|C=1) = 1/2; if C = 2, door 3 is his only legal move, P(H=3|C=2) = 1; if C = 3, he can never open it, P(H=3|C=3) = 0. Bayes: P(C=2|H=3) = (1 × 1/3) / (1×1/3 + 1/2×1/3 + 0×1/3) = 2/3.",
  "autopsy": "The entire computation is the likelihood row P(H=3|C=1), P(H=3|C=2), P(H=3|C=3) = (1/2, 1, 0). Change the host's decision rule and that row changes — and so does the answer, even though you see the identical scene. Problems P2-004, P2-005, and P2-006 replay this game with different hosts; solve all three and Monty Hall stops being a riddle and becomes a table you fill in.",
  "wrong": "1/2 because two doors remain.",
  "diagnosis": "Ignoring the observation process.",
  "remediation": "Write the likelihood table P(H=3|C=c) for c = 1, 2, 3 from the host's rule, multiply by the uniform prior, and normalize. If your table has no entry that depends on the host's choices, you conditioned on the goat, not on the host.",
  "variant": "What changes if the host opens a random unpicked door and happens to reveal a goat?"
 },
 {
  "id": "P2-004",
  "title": "Monty Falls",
  "level": "Medium",
  "module": "P2",
  "hardness": [
   "H2 conditioning",
   "H11 wording"
  ],
  "tags": [
   "conditional_probability",
   "observation_process",
   "games"
  ],
  "statement": "Same three doors: one car, two goats, and you pick door 1. This host knows nothing. He trips and accidentally knocks open one of the two unpicked doors, each equally likely — it turns out to be door 3, and it happens to reveal a goat. What is the probability the car is behind door 2?",
  "answer": "1/2",
  "solution": "Same variables, new process. Let C be the car door and H the door that falls open, uniform on {2, 3} whatever C is. The observed event is “H = 3 and door 3 shows a goat.” Likelihoods: P(obs|C=1) = 1/2, P(obs|C=2) = 1/2, P(obs|C=3) = 0 (door 3 would have shown the car). C = 1 and C = 2 are equally likely under the evidence, so the answer is 1/2. The scene is pixel-identical to standard Monty Hall — a goat behind door 3 — but the observation carries less information, because this host could have exposed the car and simply didn’t.",
  "autopsy": "What you learn depends on how the information was generated, not on what you saw.",
  "wrong": "2/3, because “a goat was revealed, same as Monty Hall.”",
  "diagnosis": "Conditioning on the picture instead of the process that produced it.",
  "remediation": "Write the likelihood row for both hosts — knowing host: (1/2, 1, 0); clumsy host: (1/2, 1/2, 0) — and run Bayes on each. Only the generating process differs.",
  "variant": "Ten doors, you pick door 1. A clumsy host knocks open doors 2 through 9 at random and all happen to show goats. Compare your winning chance by switching with the knowing-host version."
 },
 {
  "id": "P2-005",
  "title": "Ninety-Eight Open Doors",
  "level": "Medium",
  "module": "P2",
  "hardness": [
   "H2 conditioning"
  ],
  "tags": [
   "conditional_probability",
   "bayes",
   "games"
  ],
  "statement": "One hundred doors, one car, ninety-nine goats. You pick door 1. The host, who knows where the car is, opens 98 of the other doors, all goats, leaving only your door and door 47 closed. What is the probability the car is behind door 47?",
  "answer": "99/100",
  "solution": "Your door keeps its original 1/100 — nothing the host did depended on it being right or wrong in a way that distinguishes it. If the car is anywhere else (probability 99/100), the host was forced to protect exactly the car’s door while opening the other 97. So the single door he left closed inherits the whole 99/100. Scaling up makes the asymmetry impossible to miss: 98 informed eliminations were compressed into one surviving door.",
  "autopsy": "If 2/3 in the three-door game still feels wrong, this is the same computation with the volume turned up — the host is an information concentrator.",
  "wrong": "1/2 — two doors remain, so it feels even.",
  "diagnosis": "False symmetry: the two closed doors did not survive the same process. Yours survived because you chose it; his survived 98 informed eliminations.",
  "remediation": "Replay with 10 doors and count directly: for each of the 10 equally likely car positions, does switching win? (It wins in 9.)",
  "variant": "Same 100 doors, but the host opens 98 doors at random and they all happen to show goats. Now what is the probability the car is behind door 47?"
 },
 {
  "id": "P2-006",
  "title": "The Lazy Host",
  "level": "Hard",
  "module": "P2",
  "hardness": [
   "H2 conditioning",
   "H11 wording"
  ],
  "tags": [
   "conditional_probability",
   "bayes",
   "host_behavior"
  ],
  "statement": "Standard setup: one car, two goats, you pick door 1. This host is predictable: among the goat doors he is allowed to open, he always opens the highest-numbered one — he only ever opens door 2 if the car is behind door 3. He opens door 3. What is the probability the car is behind door 2?",
  "answer": "1/2",
  "solution": "Same variables, third rule. P(H=3|C=1) = 1 (both goats available, he takes the higher), P(H=3|C=2) = 1 (forced), P(H=3|C=3) = 0. Bayes: P(C=2|H=3) = 1/(1+1) = 1/2. With the coin-flipping host the C=1 entry was 1/2 and the answer was 2/3; here his predictability makes “he opened 3” weaker evidence, because he does that whenever he legally can. Bonus: if this host ever opens door 2, the car is behind door 3 with certainty.",
  "autopsy": "Three hosts, one scene, three answers: coin-flip host 2/3, clumsy host 1/2, lazy host 1/2 — and lazy-host-opens-door-2 gives certainty. The answer never lived in the doors; it lives in P(host’s action | each hypothesis).",
  "wrong": "2/3, carried over from standard Monty Hall.",
  "diagnosis": "Treating “host opened door 3” as the same evidence under every host. Evidence strength depends on what else this host would have done.",
  "remediation": "Fill the table P(H=3|C=c) for all three hosts (random-tiebreak, clumsy, lazy) and run Bayes three times. Watch how only the C=1 column moves, and how the answer moves with it.",
  "variant": "The lazy host opens door 2. What is the probability the car is behind door 3?"
 },
 {
  "id": "P3-001",
  "title": "Disjoint Is Not Independent",
  "level": "Medium",
  "module": "P3",
  "hardness": [
   "H3 dependence"
  ],
  "tags": [
   "independence",
   "events"
  ],
  "statement": "Let A be “the Meridian deal closes this quarter” (probability 1/2) and B “it closes next quarter” (probability 1/6). The deal can close at most once. Are A and B independent?",
  "answer": "No",
  "solution": "P(A)=1/2 and P(B)=1/6, but the deal closes at most once, so P(A∩B)=0. Independence would require P(A∩B)=P(A)P(B)=1/12. Since 0 ≠ 1/12, they are dependent — maximally so: learning A happened drives P(B) to zero.",
  "autopsy": "Mutually exclusive positive-probability events are dependent because one rules out the other.",
  "wrong": "Yes — this quarter and next quarter feel like separate things.",
  "diagnosis": "Semantic unrelatedness confused with probabilistic independence.",
  "remediation": "Ask whether learning B happened changes P(A). It changes it to 0.",
  "variant": "A card is drawn. Are 'ace' and 'heart' independent? Are 'heart' and 'spade' independent?"
 },
 {
  "id": "P3-002",
  "title": "Pairwise But Not Mutual",
  "level": "Elite",
  "module": "P3",
  "hardness": [
   "H3 dependence",
   "H12 proof-control"
  ],
  "tags": [
   "independence",
   "parity"
  ],
  "statement": "Two independent feature flags X and Y are each on for a uniform random half of sessions. A dashboard tracks Z = “exactly one of the flags is on” (X xor Y). Show that X, Y, Z are pairwise independent but not mutually independent.",
  "answer": "Pairwise independent, not mutually independent",
  "solution": "Each of X, Y, Z is on for half of sessions. X and Y are independent by construction. For X and Z: if X is off, Z matches Y; if X is on, Z is Y flipped — either way a fair bit, so P(X=a, Z=b)=1/4 for all a,b. Same for Y and Z. But the three are not mutually independent: Z is determined by X and Y. P(all three off)=1/4, while the product of marginals is 1/8.",
  "autopsy": "Pairwise independence does not prevent a three-way constraint.",
  "wrong": "If every pair is independent, all three must be independent.",
  "diagnosis": "Pairwise vs mutual independence confusion.",
  "remediation": "Memorize xor/parity as the canonical counterexample.",
  "variant": "Choose a random even-parity 3-bit string. Analyze pairwise and mutual independence of coordinates."
 },
 {
  "id": "P4-001",
  "title": "Distribution by Story",
  "level": "Medium",
  "module": "P4",
  "hardness": [
   "H10 representation"
  ],
  "tags": [
   "binomial",
   "hypergeometric"
  ],
  "statement": "A hiring pool has 20 finalists: 8 internal and 12 external. A 5-person shortlist is drawn at random without replacement. What is the probability it contains exactly 2 internal candidates?",
  "answer": "C(8,2)C(12,3)/C(20,5)",
  "solution": "Drawing without replacement means hypergeometric. Total shortlists: C(20,5). Favorable: choose 2 of the 8 internal and 3 of the 12 external. Probability = C(8,2)C(12,3)/C(20,5).",
  "autopsy": "Distribution choice follows the generative story: without replacement means hypergeometric, not binomial.",
  "wrong": "C(5,2)(8/20)^2(12/20)^3.",
  "diagnosis": "Using binomial independence where draws are dependent.",
  "remediation": "Compare the probability the second pick is internal after an internal first pick vs after an external one.",
  "variant": "Same pool, but each pick is put back before the next (with replacement). Probability of exactly 2 internal?"
 },
 {
  "id": "P4-002",
  "title": "First Success Contract",
  "level": "Easy",
  "module": "P4",
  "hardness": [
   "H6 recursion"
  ],
  "tags": [
   "geometric",
   "waiting_time"
  ],
  "statement": "A flaky integration test passes independently with probability p on each run. What is the probability the first pass happens on run k?",
  "answer": "(1-p)^(k-1)p",
  "solution": "The first k-1 runs must fail and the k-th must pass. Independence gives (1-p)^(k-1)p.",
  "autopsy": "A geometric random variable is a waiting-time story.",
  "wrong": "p^k, multiplying success probability k times.",
  "diagnosis": "Confusing first success with all successes.",
  "remediation": "Write the required sequence: fail, fail, …, fail, pass.",
  "variant": "A rep's cold calls convert independently with probability p each. Probability the first conversion is on call k?"
 },
 {
  "id": "P5-001",
  "title": "Matches Without Independence",
  "level": "Hard",
  "module": "P5",
  "hardness": [
   "H5 expectation",
   "H3 dependence"
  ],
  "tags": [
   "linearity",
   "indicators",
   "permutations"
  ],
  "statement": "IT re-images all n laptops over the weekend and hands them back at random — a uniformly random assignment of laptops to owners. What is the expected number of people who get their own laptop back?",
  "answer": "1",
  "solution": "Let I_i be 1 if person i gets their own laptop. The number of matches is X = I_1 + … + I_n. Each I_i has P(I_i=1) = 1/n, so E[I_i] = 1/n, and by linearity E[X] = n·(1/n) = 1 — for any n. Independence is never needed.",
  "autopsy": "Linearity turns a global matching problem into local indicators.",
  "wrong": "Trying to find the entire distribution of fixed points first.",
  "diagnosis": "Over-solving; missing linearity of expectation.",
  "remediation": "Define one indicator for one local event, then sum.",
  "variant": "The schoolbook costume: a random permutation of 1…n — expected number of fixed points?"
 },
 {
  "id": "P5-002",
  "title": "Empty Servers",
  "level": "Hard",
  "module": "P5",
  "hardness": [
   "H5 expectation"
  ],
  "tags": [
   "linearity",
   "balls_bins"
  ],
  "statement": "m requests are independently assigned uniformly to n servers. What is the expected number of empty servers?",
  "answer": "n(1-1/n)^m",
  "solution": "For server i, let I_i=1 if it receives no requests. P(I_i=1)=(1-1/n)^m because each of m requests avoids it. The total empty servers X=sum I_i. Thus E[X]=n(1-1/n)^m.",
  "autopsy": "Expected number of empty boxes is easy even though empty-box counts are dependent.",
  "wrong": "Assuming exactly n-m servers are empty when m<n.",
  "diagnosis": "Confusing deterministic placement with random collisions.",
  "remediation": "Check m=2,n=2: sometimes no server is empty, sometimes one is empty.",
  "variant": "Expected number of occupied servers?"
 },
 {
  "id": "P5-003",
  "title": "Tournament Upsets",
  "level": "Hard",
  "module": "P5",
  "hardness": [
   "H5 expectation",
   "H4 symmetry"
  ],
  "tags": [
   "linearity",
   "graphs"
  ],
  "statement": "An n-team sales league plays a full round robin; every matchup has a winner, and all 2^C(n,2) outcome patterns are equally likely. What is the expected number of teams that beat every other team?",
  "answer": "n / 2^(n-1)",
  "solution": "For team i, let I_i = 1 if it beats all n-1 others: probability (1/2)^(n-1). Summing over the n teams gives n/2^(n-1).",
  "autopsy": "Even rare global dominance can be counted with one-player indicators.",
  "wrong": "Exactly one team must beat everyone.",
  "diagnosis": "Confusing total order with arbitrary tournament orientation.",
  "remediation": "For n = 3, draw the rock-paper-scissors cycle: no team dominates.",
  "variant": "Expected number of teams with exactly n-2 wins?"
 },
 {
  "id": "P6-001",
  "title": "Variance Needs Covariance",
  "level": "Hard",
  "module": "P6",
  "hardness": [
   "H3 dependence",
   "H12 proof-control"
  ],
  "tags": [
   "variance",
   "covariance",
   "indicators"
  ],
  "statement": "Second round at the same trading desk: two cards are drawn without replacement from a standard deck, and X counts the aces drawn. Compute Var(X).",
  "answer": "2*(1/13)*(12/13) + 2*(-12/2197) = 96/663 approximately 0.1448, equivalently hypergeometric variance 2*(4/52)*(48/52)*(50/51).",
  "solution": "Let I_1 and I_2 indicate whether draw 1 and draw 2 are aces. E[I_j]=4/52=1/13. Var(I_j)=p(1-p)=12/169. Cov(I_1,I_2)=P(both aces)-p^2=(4/52)(3/51)-(1/13)^2=1/221-1/169=-12/37349. Therefore Var(X)=Var(I_1)+Var(I_2)+2Cov(I_1,I_2)=24/169-24/37349=96/663. The hypergeometric formula gives the same value: 2*(4/52)*(48/52)*(50/51).",
  "autopsy": "Without replacement creates negative covariance.",
  "wrong": "Var(X)=2p(1-p) as if draws were independent.",
  "diagnosis": "Variance linearity used without covariance terms.",
  "remediation": "Compute P(draw 2 ace | draw 1 ace) and compare to P(draw 2 ace).",
  "variant": "Compute Var of red cards in 5 draws without replacement."
 },
 {
  "id": "P6-002",
  "title": "Second Moment Existence",
  "level": "Elite",
  "module": "P6",
  "hardness": [
   "H8 bounding",
   "H12 proof-control"
  ],
  "tags": [
   "second_moment",
   "existence"
  ],
  "statement": "Pages during a week on call form a nonnegative integer X with E[X] = 10 and E[X²] = 120. Prove that P(X > 0) ≥ 5/6 — at most a sixth of on-call weeks are silent.",
  "answer": "P(X>0) >= 5/6",
  "solution": "By Cauchy-Schwarz or Paley-Zygmund style reasoning, E[X]=E[X 1_{X>0}] <= sqrt(E[X^2] P(X>0)). Thus 10 <= sqrt(120 P(X>0)). Squaring gives 100 <= 120 P(X>0), so P(X>0) >= 5/6.",
  "autopsy": "A second moment controls whether expectation comes from rare huge values or common positive values.",
  "wrong": "Claiming P(X>0)=E[X]/max(X), but max is unknown.",
  "diagnosis": "Trying to convert expectation to probability without spread information.",
  "remediation": "Learn the inequality E[X]^2 <= E[X^2]P(X>0).",
  "variant": "If E[X]=a and E[X^2]=b, prove P(X>0)>=a^2/b."
 },
 {
  "id": "P7-001",
  "title": "First-Step Walk",
  "level": "Hard",
  "module": "P7",
  "hardness": [
   "H6 recursion"
  ],
  "tags": [
   "random_walk",
   "recursion"
  ],
  "statement": "A trading book's P&L moves in unit ticks: +1 with probability p, −1 with probability q = 1−p. Let h_i be the probability it hits the profit target +a before the stop-loss −b, starting from level i. Write the recurrence and boundary conditions.",
  "answer": "h_i = p h_{i+1} + q h_{i-1}, with h_a=1 and h_{-b}=0",
  "solution": "Condition on the first tick. From level i the book moves to i+1 with probability p and i−1 with probability q, so h_i = p·h_{i+1} + q·h_{i−1}. At the target, h_a = 1; at the stop, h_{−b} = 0.",
  "autopsy": "Hitting questions are state equations plus boundary conditions.",
  "wrong": "Writing h_i=p^a q^b or trying to enumerate all paths directly.",
  "diagnosis": "Missed first-step recursion and absorbing boundaries.",
  "remediation": "Draw levels −b,…,a and label the boundary values before solving.",
  "variant": "For p=q=1/2, solve h_i explicitly."
 },
 {
  "id": "P7-002",
  "title": "Two Greens in a Row",
  "level": "Elite",
  "module": "P7",
  "hardness": [
   "H6 recursion",
   "H10 representation"
  ],
  "tags": [
   "recursion",
   "coin_flips",
   "waiting_time"
  ],
  "statement": "A release gate requires two consecutive green CI runs. Each run is green independently with probability 1/2. What is the expected number of runs until the gate opens?",
  "answer": "6",
  "solution": "Let E_0 be the expected runs remaining with no streak, E_1 with one green banked. From E_0: one run happens; half the time move to E_1, half stay. E_0 = 1 + (1/2)E_1 + (1/2)E_0. From E_1: one run happens; half the time the gate opens, half you fall back. E_1 = 1 + (1/2)·0 + (1/2)E_0. Solving: E_0 = 6.",
  "autopsy": "The state is not how many runs have happened; it is the current streak relevant to the target.",
  "wrong": "4, because two greens in a row has probability 1/4.",
  "diagnosis": "Confusing expected waiting time with reciprocal of one-block probability; overlaps matter.",
  "remediation": "Compare green-green with green-red as targets: both are probability-1/4 blocks, but the expected waits differ.",
  "variant": "Expected runs until a green immediately followed by a red?"
 },
 {
  "id": "P8-001",
  "title": "Union Bound as Failure Budget",
  "level": "Medium",
  "module": "P8",
  "hardness": [
   "H8 bounding"
  ],
  "tags": [
   "union_bound",
   "reliability"
  ],
  "statement": "A system has 100 components. Each component independently fails today with probability at most 0.0001. What upper bound can you give for the probability at least one component fails?",
  "answer": "At most 0.01",
  "solution": "Let F_i be the event that component i fails. By the union bound, P(any failure)=P(∪F_i) <= sum P(F_i) <= 100*0.0001=0.01. Independence is not required for this upper bound.",
  "autopsy": "The union bound turns many bad events into a failure budget.",
  "wrong": "Computing exactly 1-(0.9999)^100 and assuming independence is necessary.",
  "diagnosis": "Exact calculation overused when a robust bound was requested.",
  "remediation": "Practice identifying when a problem asks for a bound rather than exact value.",
  "variant": "If there are n events each with probability at most epsilon, bound probability at least one occurs."
 },
 {
  "id": "P8-002",
  "title": "Markov Inequality Reality Check",
  "level": "Medium",
  "module": "P8",
  "hardness": [
   "H8 bounding"
  ],
  "tags": [
   "markov",
   "expectation"
  ],
  "statement": "Incident resolution time X is nonnegative with mean 3 hours — and that is all you know. What is the best upper bound Markov's inequality gives for P(X ≥ 12 hours)?",
  "answer": "At most 1/4",
  "solution": "Markov: P(X ≥ a) ≤ E[X]/a for nonnegative X. With a = 12: P(X ≥ 12) ≤ 3/12 = 1/4.",
  "autopsy": "Markov uses only nonnegativity and mean, so it is broad but often loose.",
  "wrong": "Assuming the probability is exactly 1/4.",
  "diagnosis": "Treating an inequality as equality.",
  "remediation": "Construct X = 3 always: P(X ≥ 12) = 0, yet Markov still says ≤ 1/4.",
  "variant": "If E[cost]=$500, bound P(cost >= $5000)."
 },
 {
  "id": "P8-003",
  "title": "Chebyshev Around the Mean",
  "level": "Hard",
  "module": "P8",
  "hardness": [
   "H8 bounding"
  ],
  "tags": [
   "chebyshev",
   "variance"
  ],
  "statement": "A demand forecast has mean 100 units and variance 25. Bound the probability that actual demand lands 15 or more units away from the mean.",
  "answer": "At most 1/9",
  "solution": "Chebyshev: P(|X−μ| ≥ t) ≤ Var(X)/t². With t = 15 and Var = 25, the bound is 25/225 = 1/9.",
  "autopsy": "Variance controls probability of being far from the mean.",
  "wrong": "Using Markov on X directly and getting a weak or irrelevant bound.",
  "diagnosis": "Wrong inequality for deviation from mean.",
  "remediation": "When seeing |X-mean|, consider variance/Chebyshev.",
  "variant": "Mean 0, variance sigma^2. Bound P(|X|>=k sigma)."
 },
 {
  "id": "P9-001",
  "title": "Random Coloring Existence",
  "level": "Elite",
  "module": "P9",
  "hardness": [
   "H9 existence",
   "H8 bounding"
  ],
  "tags": [
   "probabilistic_method",
   "union_bound"
  ],
  "statement": "A review board has m known conflict-of-interest pairs among its members. Show the board can always be split into two panels so that at least m/2 of the conflicted pairs are separated.",
  "answer": "Random partition gives expected crossing edges m/2, so some cut has at least m/2.",
  "solution": "Assign each member independently to panel A or B with probability 1/2. Any conflicted pair is separated with probability 1/2, so with X = separated pairs, E[X] = m/2 by linearity. A random split averages m/2, so some split achieves at least m/2.",
  "autopsy": "Randomness proves deterministic existence by averaging.",
  "wrong": "Trying to build the split greedily without the expectation argument.",
  "diagnosis": "Missing probabilistic method: average implies existence.",
  "remediation": "Memorize: if E[X]>=a, then some outcome has X>=a.",
  "variant": "Show every tournament has a set ordering with at least half the edges pointing forward."
 },
 {
  "id": "P9-002",
  "title": "Alteration Method",
  "level": "Elite",
  "module": "P9",
  "hardness": [
   "H9 existence",
   "H5 expectation"
  ],
  "tags": [
   "probabilistic_method",
   "alteration"
  ],
  "statement": "n projects compete for a demo day, but m pairs of them conflict (shared team — can't both present). Prove you can always pick at least n²/(2m+n) mutually conflict-free projects. Hint: pick projects at random, then drop one from every conflicted pair you picked.",
  "answer": "Independent set size at least n^2/(2m+n)",
  "solution": "Select each project independently with probability p: expected picks pn, expected conflicted pairs among picks p²m. Drop one project from each conflicted pair; the rest is conflict-free with expected size at least pn − p²m. Optimizing at p = n/(2m+n) gives n²/(2m+n), so some selection achieves it.",
  "autopsy": "Randomly build something imperfect, then alter it to remove defects.",
  "wrong": "Assuming the random selection is already conflict-free.",
  "diagnosis": "Forgetting the alteration step.",
  "remediation": "Separate construction from cleanup: picked projects minus picked conflicts.",
  "variant": "Use random selection plus deletion to prove a lower bound for a subset with no forbidden pair."
 },
 {
  "id": "P10-001",
  "title": "Entropy Upper Bound on Choices",
  "level": "Elite",
  "module": "P10",
  "hardness": [
   "H10 representation",
   "H12 proof-control"
  ],
  "tags": [
   "entropy",
   "counting"
  ],
  "statement": "A triage bot must identify which of |S| known failure modes a ticket belongs to, using yes/no questions. If X is the failure mode and all |S| modes are equally likely, what is H(X) — and why can no distribution on S have more entropy?",
  "answer": "H(X)=log2 |S|; maximum entropy on finite support is uniform.",
  "solution": "Uniform on S means each mode has probability 1/|S|, so H(X) = Σ (1/|S|)·log₂|S| = log₂|S|. Entropy on a fixed finite support is maximized by the uniform distribution, so any X supported on S has H(X) ≤ log₂|S| — you never need more than about log₂|S| well-chosen yes/no questions.",
  "autopsy": "Entropy converts support size into uncertainty budget.",
  "wrong": "Saying entropy equals |S|.",
  "diagnosis": "Confusing number of states with log-number of bits needed to identify a state.",
  "remediation": "Ask: how many yes/no questions identify one of |S| equally likely states?",
  "variant": "How many bits of entropy does a fair die roll have?"
 },
 {
  "id": "MX-001",
  "title": "At Least One Pair, But Which Method?",
  "level": "Hard",
  "module": "Mixed",
  "hardness": [
   "H1 sample-space",
   "H8 bounding"
  ],
  "tags": [
   "union_bound",
   "birthday",
   "method_choice"
  ],
  "statement": "n teams each independently pick one of 365 release days at random. You need a one-line answer in the planning meeting: give a quick upper bound for the probability that at least two teams pick the same day.",
  "answer": "At most C(n,2)/365",
  "solution": "For each pair of teams {i, j}, let A_ij be the event they picked the same day: P(A_ij) = 1/365. A shared day anywhere is the union of the A_ij, so by the union bound the probability is at most C(n,2)/365.",
  "autopsy": "Exact birthday probability uses complement; quick upper bound uses union bound.",
  "wrong": "Using the bound as an exact probability.",
  "diagnosis": "Method-choice confusion: bound vs exact answer.",
  "remediation": "Compare this with the exact complement formula from P1-002 — the bound is the meeting answer, the complement is the memo answer.",
  "variant": "Bound probability any two of n hashes collide in m buckets."
 },
 {
  "id": "MX-002",
  "title": "Condition on the First Draw",
  "level": "Medium",
  "module": "Mixed",
  "hardness": [
   "H2 conditioning",
   "H6 recursion"
  ],
  "tags": [
   "conditional_probability",
   "cards"
  ],
  "statement": "Another interview classic: a card is drawn from a deck and set aside unseen; a second card is drawn and it is an ace. What is the probability the first, hidden card was an ace?",
  "answer": "3/51 = 1/17",
  "solution": "Given the second card is an ace, the remaining unknown first card is equally likely among the other 51 card positions relative to that ace. There are 3 remaining aces among those 51 possibilities. Probability = 3/51 = 1/17. Equivalently, by symmetry, after seeing one ace in one position, any other position has probability 3/51 of being ace.",
  "autopsy": "Conditioning on a later observation changes the distribution of the earlier hidden card.",
  "wrong": "4/52, because the first card was drawn before the observation.",
  "diagnosis": "Failing to update a hidden past event after later evidence.",
  "remediation": "Think of all two-card ordered deals where the second card is ace.",
  "variant": "Third card is king. Probability first card was king?"
 },
 {
  "id": "MX-003",
  "title": "Expected Collisions",
  "level": "Hard",
  "module": "Mixed",
  "hardness": [
   "H5 expectation",
   "H1 sample-space"
  ],
  "tags": [
   "linearity",
   "balls_bins",
   "collisions"
  ],
  "statement": "m requests are hashed independently and uniformly into n buckets. What is the expected number of unordered pairs of requests that collide in the same bucket?",
  "answer": "C(m,2)/n",
  "solution": "For each unordered pair of requests {i, j}, let I_ij = 1 if they hash to the same bucket; after request i lands anywhere, request j matches with probability 1/n. Summing over C(m,2) pairs gives C(m,2)/n.",
  "autopsy": "Pair indicators avoid tracking the full occupancy distribution.",
  "wrong": "m/n or n(1-1/n)^m.",
  "diagnosis": "Counting occupied or empty buckets instead of colliding pairs.",
  "remediation": "Name the object being counted: pairs of requests, not buckets.",
  "variant": "Expected number of equal-birthday pairs among m people."
 },
 {
  "id": "MX-004",
  "title": "The Inspection Paradox Lite",
  "level": "Elite",
  "module": "Mixed",
  "hardness": [
   "H2 conditioning",
   "H11 wording"
  ],
  "tags": [
   "conditional_probability",
   "size_bias"
  ],
  "statement": "Half your customer accounts have 1 seat and half have 3 seats. A support ticket arrives from a uniformly random seat across all accounts. What is the probability it comes from a 3-seat account?",
  "answer": "3/4",
  "solution": "3-seat accounts contribute three times the seats. For every two accounts there are 4 seats, 3 of them on the 3-seat account. Probability = 3/4.",
  "autopsy": "Sampling a seat is not sampling an account; bigger accounts are size-biased.",
  "wrong": "1/2, because half of the accounts are 3-seat.",
  "diagnosis": "Wrong sampling unit: seat-level sampling biases toward larger accounts.",
  "remediation": "Ask: what exactly was sampled uniformly? Account or seat?",
  "variant": "A random user-session is inspected. Longer sessions are more likely to be sampled."
 },
 {
  "id": "MX-005",
  "title": "Conditional Independence Breaks",
  "level": "Elite",
  "module": "Mixed",
  "hardness": [
   "H3 dependence",
   "H2 conditioning"
  ],
  "tags": [
   "conditional_independence",
   "bayes"
  ],
  "statement": "Two monitors fire independently, each with probability 1/2 today: A = “latency monitor fired,” B = “error-rate monitor fired.” Independent, yes. Now condition on C: “at least one monitor fired.” Are A and B still independent given C?",
  "answer": "No",
  "solution": "Given C, the equally likely outcomes are latency-only, errors-only, and both. P(A|C) = 2/3 and P(B|C) = 2/3, but P(A∩B|C) = 1/3 ≠ 4/9. Not independent given C.",
  "autopsy": "Conditioning on a shared constraint can create dependence.",
  "wrong": "Yes — the monitors were independent to begin with.",
  "diagnosis": "Assuming independence survives conditioning.",
  "remediation": "Conditioning changes the universe; retest independence inside the new universe.",
  "variant": "Are two disease symptoms independent after conditioning on having at least one symptom?"
 },
 {
  "id": "MX-006",
  "title": "Random Order Symmetry",
  "level": "Hard",
  "module": "Mixed",
  "hardness": [
   "H4 symmetry"
  ],
  "tags": [
   "symmetry",
   "order_statistics"
  ],
  "statement": "n vendors demo their products in uniformly random order. What is the probability the strongest product is demoed before the runner-up?",
  "answer": "1/2",
  "solution": "Ignore the other vendors entirely: the two demos that matter occur in either relative order with equal probability. 1/2.",
  "autopsy": "Random ordering often reduces to relative order symmetry among the important objects.",
  "wrong": "1/n, because the strongest would have to go first.",
  "diagnosis": "Confusing 'before a specific item' with 'first overall'.",
  "remediation": "Delete the irrelevant vendors and compare only the two labels that matter.",
  "variant": "Probability the strongest product is demoed after both the runner-up and the third-best?"
 },
 {
  "id": "MX-007",
  "title": "Stop When Ahead?",
  "level": "Elite",
  "module": "Mixed",
  "hardness": [
   "H7 martingale",
   "H11 wording"
  ],
  "tags": [
   "martingale",
   "optional_stopping",
   "games"
  ],
  "statement": "A day trader runs a strategy that each period wins $1 or loses $1 with equal probability, and plans to “just stop once I'm up $1.” Is the expected gain necessarily +$1, with a finite expected wait? Explain the trap.",
  "answer": "The stopping rule may have infinite expected time or hidden constraints; optional stopping conditions matter.",
  "solution": "The bankroll is a fair-game martingale: zero expected change per period. Stopping when ahead seems to lock in +$1 — and the walk does hit +1 eventually with probability 1 — but the expected time to get there is infinite, and optional-stopping guarantees require conditions such as bounded time or bounded increments. Free profit from a fair game is exactly what those conditions rule out; in practice the finite bankroll binds first.",
  "autopsy": "Martingale intuition is powerful but must be paired with stopping-condition discipline.",
  "wrong": "You can guarantee profit from a fair game by waiting long enough.",
  "diagnosis": "Optional-stopping fallacy.",
  "remediation": "Learn the checklist: bounded time, bounded increments, finite expectation, absorbing boundaries.",
  "variant": "What changes with a stop at +$1 or −$M (the margin call), whichever comes first?"
 },
 {
  "id": "MX-008",
  "title": "Maximum of Uniforms",
  "level": "Hard",
  "module": "Mixed",
  "hardness": [
   "H10 representation"
  ],
  "tags": [
   "continuous_probability",
   "cdf"
  ],
  "statement": "n independent services each respond in a Uniform(0,1)-second time, and the page renders when the slowest one finishes. What is P(render time ≤ t), for 0 ≤ t ≤ 1?",
  "answer": "t^n",
  "solution": "The slowest response is ≤ t exactly when every service responds in ≤ t. By independence, P = t^n.",
  "autopsy": "For maxima, use the all-below-threshold event.",
  "wrong": "n t or t/n.",
  "diagnosis": "Not translating maximum into an all-event.",
  "remediation": "Write max ≤ t iff X₁ ≤ t and … and X_n ≤ t.",
  "variant": "Find the CDF of the fastest response (the minimum)."
 },
 {
  "id": "MX-009",
  "title": "Tail Sum Formula",
  "level": "Hard",
  "module": "Mixed",
  "hardness": [
   "H5 expectation",
   "H10 representation"
  ],
  "tags": [
   "expectation",
   "tail_sum"
  ],
  "statement": "A subscription's lifetime in whole months is a nonnegative integer X. Prove E[X] = Σ_{k≥1} P(X ≥ k) — expected lifetime is exactly the sum of the survival curve.",
  "answer": "E[X]=Σ_{k≥1}P(X≥k)",
  "solution": "For any nonnegative integer x, x = sum_{k>=1} 1_{x>=k}. Therefore X = sum_{k>=1} 1_{X>=k}. Taking expectations and using linearity gives E[X]=sum_{k>=1} E[1_{X>=k}] = sum_{k>=1} P(X>=k).",
  "autopsy": "Expectation can be represented as stacked tail probabilities.",
  "wrong": "Thinking expectation always requires the PMF directly.",
  "diagnosis": "Missing alternate representation of expectation.",
  "remediation": "Draw X as a stack of unit blocks and count layers.",
  "variant": "Use the formula on a geometric lifetime: monthly churn probability c, expected months retained?"
 },
 {
  "id": "MX-010",
  "title": "Poisson Approximation Intuition",
  "level": "Hard",
  "module": "Mixed",
  "hardness": [
   "H10 representation",
   "H8 bounding"
  ],
  "tags": [
   "poisson",
   "binomial",
   "approximation"
  ],
  "statement": "A website has 10,000 independent users, each with probability 0.0002 of clicking a rare button today. What distribution is a good approximation for the total clicks, and what is its mean?",
  "answer": "Poisson with λ=2",
  "solution": "The count is Binomial(n=10000,p=0.0002). For large n and small p with np moderate, a Poisson approximation with λ=np is appropriate. Here λ=10000*0.0002=2.",
  "autopsy": "Poisson models many rare independent opportunities with stable total rate.",
  "wrong": "Normal approximation by default, or Bernoulli because each user clicks or not.",
  "diagnosis": "Not matching distribution to generative story and scale.",
  "remediation": "Use the checklist: many trials, rare event, roughly independent, count total events.",
  "variant": "Approximate probability of zero clicks."
 },
 {
  "id": "BOSS-001",
  "title": "The Hidden Indicator Boss",
  "level": "Boss",
  "module": "Mixed",
  "hardness": [
   "H5 expectation",
   "H4 symmetry",
   "H12 proof-control"
  ],
  "tags": [
   "linearity",
   "permutation",
   "inversions"
  ],
  "statement": "A backlog of n tickets has a true priority order, but the grooming session left it uniformly randomly shuffled. A pair of tickets is misfiled if the lower-priority one sits above the higher-priority one. What is the expected number of misfiled pairs?",
  "answer": "n(n-1)/4",
  "solution": "For each pair of positions i<j, let I_ij = 1 if that pair is misfiled. The two relative orders are equally likely, so P(I_ij=1) = 1/2. There are C(n,2) pairs, so by linearity the expected count is C(n,2)/2 = n(n−1)/4.",
  "autopsy": "Pair-level symmetry plus linearity beats distribution-level enumeration.",
  "wrong": "Trying to enumerate orderings, or assuming misfilings are independent.",
  "diagnosis": "Not decomposing global disorder into local pair indicators.",
  "remediation": "For n = 3, list all six orders and compare with the indicator computation.",
  "variant": "Expected number of adjacent misfilings — positions i where the ticket at i outranks the ticket at i+1?"
 },
 {
  "id": "BOSS-002",
  "title": "Bayes Meets Sampling Bias",
  "level": "Boss",
  "module": "Mixed",
  "hardness": [
   "H2 conditioning",
   "H11 wording",
   "H10 representation"
  ],
  "tags": [
   "bayes",
   "size_bias",
   "sampling"
  ],
  "statement": "A company has two kinds of teams. 80% of teams are small with 5 people; 20% are large with 20 people. You pick a random employee uniformly from the company and ask whether their team is large. What is the probability they are on a large team?",
  "answer": "1/2",
  "solution": "Out of 100 teams, 80 small teams contain 400 employees and 20 large teams contain 400 employees. A random employee is equally likely to come from either 400-person pool, so the probability is 400/(400+400)=1/2.",
  "autopsy": "Sampling employees size-biases team type relative to sampling teams.",
  "wrong": "20%, because only 20% of teams are large.",
  "diagnosis": "Sampling unit error: employee-weighted vs team-weighted probability.",
  "remediation": "Convert team proportions into employee counts before conditioning.",
  "variant": "What if large teams have 50 people?"
 },
 {
  "id": "BOSS-003",
  "title": "A Random Graph First Moment",
  "level": "Boss",
  "module": "P9",
  "hardness": [
   "H9 existence",
   "H5 expectation",
   "H8 bounding"
  ],
  "tags": [
   "random_graph",
   "first_moment",
   "probabilistic_method"
  ],
  "statement": "Model your partner ecosystem as G(n, 1/2): n companies, each pair independently connected with probability 1/2. What is the expected number of closed triangles — triples where all three pairwise relationships exist?",
  "answer": "C(n,3)/8",
  "solution": "For each triple of companies, let I_T = 1 if all three edges exist: probability (1/2)³ = 1/8. There are C(n,3) triples, so the expected count is C(n,3)/8.",
  "autopsy": "Random graph substructure counts are usually indicator sums over vertex sets.",
  "wrong": "n³/8 without accounting for unordered triples, or demanding that triangle events be independent.",
  "diagnosis": "Incorrect indexing object; sum over triples, not ordered sequences unless corrected.",
  "remediation": "Always define the indexing set for indicators.",
  "variant": "Expected number of k-cliques in G(n,p)."
 }
];
const LM_MODULES = {
 "P0": {
  "title": "Probability Setup",
  "tag": "Name the universe before you count it.",
  "concepts": [
   "outcome",
   "event",
   "sample space",
   "uniform vs non-uniform probability",
   "complement",
   "partition",
   "event algebra"
  ],
  "moves": [
   "Name the random experiment.",
   "Write the sample space before computing.",
   {"move": "Use the complement when the direct count is messy.",
    "why": "Direct counts explode on “at least one” events. “At least one ace in five cards” means exactly 1, or 2, or 3, or 4 aces — four separate counts, then a sum. The opposite event is one clean count: “no aces” is C(48,5) hands. So P(at least one ace) = 1 − C(48,5)/C(52,5). One subtraction replaces four counts, and the gap widens fast: “at least one collision among 40 birthdays” is dozens of cases directly, one product via the complement. The signal to switch: the event says “at least” or “some” — its complement says “none” or “all”, and none/all events are almost always a single count. P(A) = 1 − P(not A) lets you count whichever side of the door is cheaper."}
  ],
  "traps": [
   "Assuming uniformity without justification.",
   "Counting descriptions instead of outcomes.",
   "Ignoring impossible cases."
  ]
 },
 "P1": {
  "title": "Counting for Probability",
  "tag": "Count favorable and total in the same representation.",
  "concepts": [
   "multiplication principle",
   "permutations",
   "combinations",
   "stars and bars",
   "inclusion-exclusion",
   "bijections"
  ],
  "moves": [
   {"move": "Decide whether order matters.",
    "why": "Order matters when the process distinguishes positions: sequences, rankings, PINs, seat assignments. There, (A,B) and (B,A) are different outcomes — count with permutations. Order does not matter when the result is a set: a poker hand, a committee, a lottery ticket. There, {A,B} is one outcome however it arrived — count with combinations. The test: swap two elements of an outcome. Different result? Order matters. Same result? It doesn't. And when in doubt in probability, make everything ordered — ordered outcomes are equally likely by construction, and the extra factor cancels as long as you order the numerator and denominator the same way."},
   "Count favorable and total outcomes in the same representation.",
   {"move": "Count a different, easier thing (a bijection).",
    "why": "A bijection is a perfect one-to-one matching between two collections: every item in one pairs with exactly one item in the other, so the two collections must be the same size. That turns awkward counts into easy ones — if the thing you're asked to count matches one-for-one with something simpler, count the simpler thing. Example: a 64-player knockout tournament — how many matches until a champion? Tracing brackets is painful. But every match eliminates exactly one player, and every eliminated player lost exactly one match: matches pair perfectly with eliminated players. 63 players get eliminated, so 63 matches. No brackets, no formula — just a better thing to count."}
  ],
  "traps": [
   "Double counting.",
   "Switching sample spaces mid-solution.",
   "Treating identical objects as distinct."
  ]
 },
 "P2": {
  "title": "Conditional Probability",
  "tag": "Information changes which worlds are still possible.",
  "concepts": [
   "P(A|B)",
   "conditioning as shrinking the universe",
   "Bayes theorem",
   "law of total probability",
   "base rates"
  ],
  "moves": [
   "Condition on what was observed, not what you wish were observed.",
   "Split by cases that are observable or structurally complete.",
   "Use trees for sequential information."
  ],
  "traps": [
   "Reversing P(A|B) and P(B|A).",
   "Base-rate neglect.",
   "Conditioning on a zero-probability or ambiguous event."
  ]
 },
 "P3": {
  "title": "Independence and Dependence",
  "tag": "Independence is about information transfer, not surface unrelatedness.",
  "concepts": [
   "pairwise independence",
   "mutual independence",
   "conditional independence",
   "dependence created by constraints"
  ],
  "moves": [
   "Test independence by information transfer.",
   "Check algebraically only after intuition.",
   "Distinguish “unrelated-looking” from independent."
  ],
  "traps": [
   "Assuming disjoint means independent.",
   "Assuming pairwise independence implies mutual independence.",
   "Missing dependence after conditioning."
  ]
 },
 "P4": {
  "title": "Random Variables and Distributions",
  "tag": "Choose the distribution by its generative story.",
  "concepts": [
   "random variable as function on outcomes",
   "Bernoulli, Binomial, Geometric, Hypergeometric, Poisson",
   "distribution, CDF, PMF",
   "continuous density basics"
  ],
  "moves": [
   "Define the random variable before computing.",
   "Choose the distribution by generative story.",
   "Check support and normalization."
  ],
  "traps": [
   "Confusing probability with value.",
   "Using binomial when sampling without replacement.",
   "Forgetting continuous probabilities at exact points are zero."
  ]
 },
 "P5": {
  "title": "Expectation",
  "tag": "Replace one impossible global count with many easy local ones.",
  "concepts": [
   "expected value",
   "linearity of expectation",
   "indicator variables",
   "tail-sum formula",
   "conditional expectation"
  ],
  "moves": [
   "Replace a hard global count with a sum of local indicators.",
   "Compute expectation without the full distribution.",
   "Condition on the first step."
  ],
  "traps": [
   "Assuming expectation means likely.",
   "Requiring independence for linearity.",
   "Missing indicator definitions."
  ]
 },
 "P6": {
  "title": "Variance and Second Moment",
  "tag": "Spread is where dependence hides.",
  "concepts": [
   "variance",
   "covariance",
   "second moment method",
   "Chebyshev",
   "Paley-Zygmund intuition"
  ],
  "moves": [
   "Compute spread to show typicality.",
   "Use covariance to handle dependence.",
   "Compare first and second moments."
  ],
  "traps": [
   "Treating variance as linear without covariance.",
   "Forgetting dependence terms.",
   "Using expectation to claim existence without support."
  ]
 },
 "P7": {
  "title": "Recursion, Random Walks, Markov Chains",
  "tag": "After the first step, a smaller copy of the same problem remains.",
  "concepts": [
   "first-step analysis",
   "absorbing states",
   "transition matrices",
   "stationary distribution",
   "gambler's ruin"
  ],
  "moves": [
   "Condition on the first move.",
   "Write equations for states.",
   "Use symmetry or boundary conditions."
  ],
  "traps": [
   "Using steady-state logic before absorption.",
   "Ignoring boundary states.",
   "Solving a recurrence without checking meaning."
  ]
 },
 "P8": {
  "title": "Inequalities and Concentration",
  "tag": "When exact is impossible, bound the failure.",
  "concepts": [
   "Markov inequality",
   "Chebyshev inequality",
   "Chernoff intuition",
   "union bound",
   "concentration vs expectation"
  ],
  "moves": [
   "Prove an unlikely bad event via a bound.",
   "Use the union bound as a budget of failure.",
   "Choose the inequality by the information available."
  ],
  "traps": [
   "Using a sharp-looking inequality with missing assumptions.",
   "Confusing an upper bound with the exact probability.",
   "Ignoring dependence assumptions."
  ]
 },
 "P9": {
  "title": "Coupling and Probabilistic Method",
  "tag": "Randomness can prove that a deterministic object exists.",
  "concepts": [
   "coupling",
   "stochastic dominance",
   "existence by random construction",
   "alteration method",
   "Lovász local lemma intuition"
  ],
  "moves": [
   "Put two random objects on one probability space.",
   "Prove existence by positive probability.",
   "Delete bad structures after random construction."
  ],
  "traps": [
   "Comparing distributions without constructing a joint process.",
   "Proving the average is good but not the existence condition.",
   "Not managing dependencies among bad events."
  ]
 },
 "P10": {
  "title": "Entropy and Information",
  "tag": "Counting is compression in disguise.",
  "concepts": [
   "entropy as uncertainty",
   "chain rule",
   "mutual information intuition",
   "compression proofs"
  ],
  "moves": [
   "Convert counting to information.",
   "Prove impossibility by compression.",
   "Use the entropy chain rule for sequential uncertainty."
  ],
  "traps": [
   "Treating entropy as variance.",
   "Ignoring support size.",
   "Using information language without exact definitions."
  ]
 },
 "Mixed": {
  "title": "Mixed Arena",
  "tag": "No module label, no cue. Recognize the move yourself.",
  "concepts": [],
  "moves": [
   "Identify which module's move applies before computing."
  ],
  "traps": [
   "Letting the surface wording pick the method for you."
  ]
 }
};
const LM_HARDNESS = {
 "H1": {
  "name": "Sample-space hardness",
  "q": "Are you counting favorable and total outcomes in the same representation?"
 },
 "H2": {
  "name": "Conditioning hardness",
  "q": "What exactly became known, and how did it become known?"
 },
 "H3": {
  "name": "Dependence hardness",
  "q": "If one event happens, does it change the probability of the other?"
 },
 "H4": {
  "name": "Symmetry hardness",
  "q": "Is there an exchangeability or ordering symmetry hidden under the wording?"
 },
 "H5": {
  "name": "Linearity-of-expectation hardness",
  "q": "Can I count the expected number of local successes instead of the global distribution?"
 },
 "H6": {
  "name": "Recursion hardness",
  "q": "After the first move, what smaller version of the same problem remains?"
 },
 "H7": {
  "name": "Invariant / martingale hardness",
  "q": "What quantity has no drift from one step to the next?"
 },
 "H8": {
  "name": "Bounding hardness",
  "q": "What failure event can I union-bound, dominate, or concentrate?"
 },
 "H9": {
  "name": "Existence hardness",
  "q": "If I choose randomly, is the expected number of defects less than one?"
 },
 "H10": {
  "name": "Representation hardness",
  "q": "What is this problem secretly isomorphic to?"
 },
 "H11": {
  "name": "Adversarial wording hardness",
  "q": "What assumption did the wording tempt me to make?"
 },
 "H12": {
  "name": "Proof-control hardness",
  "q": "Which statement would a skeptical grader reject?"
 }
};
const LM_CHECK = {
 "P0-001": {
  "v": 0.16666666666666666,
  "show": "1/6"
 },
 "P2-001": {
  "v": 0.3333333333333333,
  "show": "1/3"
 },
 "P2-002": {
  "v": 0.3333333333333333,
  "show": "1/3"
 },
 "P2-003": {
  "v": 0.6666666666666666,
  "show": "2/3"
 },
 "P5-001": {
  "v": 1,
  "show": "1"
 },
 "P6-002": {
  "v": 0.8333333333333334,
  "show": "5/6",
  "prompt": "Enter the lower bound for P(X > 0)."
 },
 "P7-002": {
  "v": 6,
  "show": "6"
 },
 "P8-001": {
  "v": 0.01,
  "show": "0.01",
  "prompt": "Enter the upper bound."
 },
 "P8-002": {
  "v": 0.25,
  "show": "1/4",
  "prompt": "Enter the upper bound."
 },
 "P8-003": {
  "v": 0.1111111111111111,
  "show": "1/9",
  "prompt": "Enter the upper bound."
 },
 "MX-002": {
  "v": 0.058823529411764705,
  "show": "1/17"
 },
 "MX-004": {
  "v": 0.75,
  "show": "3/4"
 },
 "MX-006": {
  "v": 0.5,
  "show": "1/2"
 },
 "BOSS-002": {
  "v": 0.5,
  "show": "1/2"
 },
 "P2-004": {
  "v": 0.5,
  "show": "1/2"
 },
 "P2-005": {
  "v": 0.99,
  "show": "99/100"
 },
 "P2-006": {
  "v": 0.5,
  "show": "1/2"
 }
};
const LM_YESNO = {
 "P3-001": "no",
 "MX-005": "no"
};
