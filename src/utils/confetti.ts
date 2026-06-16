/**
 * Shared celebration confetti. Single source of truth so the home page
 * (first-time unlock-all) and the global achievements modal (replay button)
 * fire the exact same burst instead of drifting apart.
 *
 * canvas-confetti is imported dynamically to keep it out of the initial bundle.
 */
export function fireConfetti() {
  import('canvas-confetti').then((confettiModule) => {
    const confetti = confettiModule.default;
    const colors = ['#b87333', '#76d6d5', '#ffffff']; // Copper, Teal, White

    // 1. Initial powerful central burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: colors,
      zIndex: 999,
    };

    function fire(particleRatio: number, opts: Record<string, unknown>) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // 2. Left side cannon
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
        scalar: 1.2,
      });
    }, 300);

    // 3. Right side cannon
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.65 },
        scalar: 1.2,
      });
    }, 600);

    // 4. Random "popcorn" bursts for sustained excitement
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: Math.floor(Math.random() * 20) + 15,
          spread: 60,
          origin: {
            x: 0.2 + Math.random() * 0.6,
            y: 0.2 + Math.random() * 0.4,
          },
          scalar: 0.8,
          gravity: 1.2,
          drift: Math.random() > 0.5 ? 2 : -2,
        });
      }, 900 + i * 250);
    }
  });
}
