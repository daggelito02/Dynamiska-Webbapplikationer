// nav-toggle.js - Accessible mobile navigation toggle
(function() {
  const navButton = document.querySelector('.nav-toggle-btn');
  const navList = document.getElementById('primary-navigation');

  if (!navButton || !navList) return;

  // Toggle navigation when button is clicked
  navButton.addEventListener('click', () => {
    const isOpen = navList.classList.contains('is-open');
    navList.classList.toggle('is-open');
    navButton.setAttribute('aria-expanded', !isOpen);
  });

  // Close menu when Escape is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) {
      navList.classList.remove('is-open');
      navButton.setAttribute('aria-expanded', 'false');
      navButton.focus(); // Return focus to button
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navList.classList.contains('is-open') && 
        !navButton.contains(e.target) && 
        !navList.contains(e.target)) {
      navList.classList.remove('is-open');
      navButton.setAttribute('aria-expanded', 'false');
    }
  });
})();
