export function renderApp(root: HTMLElement): void {
  root.innerHTML = `
    <main class="page">
      <div class="orb orb--one" aria-hidden="true"></div>
      <div class="orb orb--two" aria-hidden="true"></div>
      <section class="intro" aria-labelledby="game-title">
        <p class="eyebrow">RS School · TypeScript Mini-Game</p>
        <div class="symbol" aria-hidden="true">⚗</div>
        <h1 id="game-title">Alchemist's <span>Cauldron</span></h1>
        <p class="lead">Mix ingredients. Balance the elements. Brew the perfect potion.</p>
        <div class="status" role="status">
          <span class="status__dot" aria-hidden="true"></span>
          Precondition 1 — technical foundation ready
        </div>
      </section>
      <section class="features" aria-label="Technology stack">
        <article class="feature">
          <span class="feature__number">01</span>
          <h2>TypeScript</h2>
          <p>Strict typing and a clean separation of game logic from UI.</p>
        </article>
        <article class="feature">
          <span class="feature__number">02</span>
          <h2>Vite</h2>
          <p>A fast development server and reproducible production build.</p>
        </article>
        <article class="feature">
          <span class="feature__number">03</span>
          <h2>Quality Tools</h2>
          <p>ESLint, Prettier, and Git hooks prepared for future stories.</p>
        </article>
      </section>
      <footer class="footer">Gameplay will be implemented in Level 1.</footer>
    </main>
  `;
}
