// ui-helpers.js - Hjälpfunktioner för UI-interaktioner

export function initNavToggle() {
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navList = document.querySelector('.navigation-list');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('is-open');
  });
}

export function initAsideToggle() {
  const toggleBtn = document.getElementById('search-info-toggle');
  const infoContainer = document.getElementById('search-info');
  
  if (!toggleBtn || !infoContainer) return;
  
  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    infoContainer.classList.toggle('open');
  });
}
