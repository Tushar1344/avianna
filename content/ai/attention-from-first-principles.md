Attention is often introduced as a formula to memorize:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V.
$$

That's the destination. This note builds it from the question it answers.

## The question

Suppose each token wants to gather information from every other token, but *how much* it gathers should depend on relevance. We need three things per token:

- a **query** $q$ — what this token is looking for,
- a **key** $k$ — what each token offers,
- a **value** $v$ — what each token actually contributes.

Relevance of token $j$ to token $i$ is a similarity score. The dot product $q_i \cdot k_j$ is the cheapest reasonable choice.

## From scores to weights

Raw scores aren't a distribution, so we normalize with softmax over $j$:

$$
\alpha_{ij} = \frac{\exp(q_i \cdot k_j)}{\sum_{j'} \exp(q_i \cdot k_{j'})}.
$$

The output for token $i$ is the weighted sum $\sum_j \alpha_{ij}\, v_j$.

### Why divide by $\sqrt{d_k}$?

If $q$ and $k$ have components with unit variance, then $q \cdot k$ has variance $d_k$. Large magnitudes push softmax into saturated regions where gradients vanish. Dividing by $\sqrt{d_k}$ keeps the score variance near $1$.

## A tiny implementation

```python
import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)   # (n_q, n_k)
    weights = softmax(scores, axis=-1)
    return weights @ V                 # (n_q, d_v)

Q = np.random.randn(3, 8)
K = np.random.randn(5, 8)
V = np.random.randn(5, 4)
print(attention(Q, K, V).shape)        # (3, 4)
```

## What you get for free

Because attention is just a weighted average, it is *permutation-equivariant* — shuffle the keys/values and the output follows. That is also why transformers need positional encodings: the mechanism itself has no notion of order.

> Multi-head attention is this same operation run in parallel on several learned projections, then concatenated — letting the model attend to different kinds of relationships at once.
