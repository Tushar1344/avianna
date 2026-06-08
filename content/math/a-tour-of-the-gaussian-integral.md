The Gaussian integral

$$
I = \int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

shows up everywhere — probability, statistical mechanics, Fourier analysis. What makes it lovely is that the one-dimensional integral has no elementary antiderivative, yet the answer is exactly $\sqrt{\pi}$. Here are three ways to see it.

## The polar trick

The standard move is to compute $I^2$ as a double integral and switch to polar coordinates:

$$
I^2 = \left(\int_{-\infty}^{\infty} e^{-x^2}\,dx\right)\left(\int_{-\infty}^{\infty} e^{-y^2}\,dy\right) = \iint_{\mathbb{R}^2} e^{-(x^2+y^2)}\,dx\,dy.
$$

With $x = r\cos\theta$, $y = r\sin\theta$ and area element $dx\,dy = r\,dr\,d\theta$,

$$
I^2 = \int_0^{2\pi}\!\!\int_0^{\infty} e^{-r^2}\, r\,dr\,d\theta = 2\pi \cdot \tfrac{1}{2} = \pi,
$$

so $I = \sqrt{\pi}$. The inner integral is elementary because that stray factor of $r$ is exactly the derivative we need: $\frac{d}{dr}\!\left(-\tfrac12 e^{-r^2}\right) = r e^{-r^2}$.

## Why this is the one you remember

The polar trick works because the integrand $e^{-(x^2+y^2)}$ is *rotationally symmetric* — it depends only on $r^2 = x^2 + y^2$. Squaring a hard 1D integral to expose a hidden symmetry in 2D is a pattern worth keeping in your toolbox.

## A differentiation-under-the-integral variant

Define

$$
F(t) = \left(\int_0^t e^{-x^2}\,dx\right)^2, \qquad G(t) = \int_0^1 \frac{e^{-t^2(1+x^2)}}{1+x^2}\,dx.
$$

One can show $F'(t) + G'(t) = 0$, so $F + G$ is constant. Evaluating at $t = 0$ and $t \to \infty$ pins the constant to $\tfrac{\pi}{4}$, which again gives $\int_0^\infty e^{-x^2}\,dx = \tfrac{\sqrt\pi}{2}$.

> The two methods are the same idea wearing different clothes: introduce an auxiliary variable, exploit a symmetry the 1D problem hides.

## The general moment

Scaling $x \mapsto x/\sqrt{a}$ gives the version you actually use in practice:

$$
\int_{-\infty}^{\infty} e^{-a x^2}\,dx = \sqrt{\frac{\pi}{a}}, \qquad a > 0.
$$

Differentiating both sides with respect to $a$ generates every even moment of the Gaussian for free — which is exactly how the normalizing constant of the normal distribution falls out.
