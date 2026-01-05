// ui-toggles.js - Toggling för UI-element

export function setupToggle({
  button,
  target,
  openClass = 'is-open',
}) {
  const toggleBtn = document.querySelector(button);
  const targetEl = document.querySelector(target);

  if (!toggleBtn || !targetEl) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    targetEl.classList.toggle(openClass);
  });
}

export function mobileMenu() {
  setupToggle({
    button: '.nav-toggle-btn',
    target: '.navigation-list',
  });
}

export function asideToggle() {
  setupToggle({
    button: '#search-info-toggle',
    target: '#search-info',
  });
}
