// nav-toggle.js - Accessible mobile navigation toggle
(function() {
  const navButton = document.querySelector('.nav-toggle-btn');
  const navList = document.getElementById('primary-navigation');

  if (!navButton || !navList) return;

  // Get all navigation links
  const getNavLinks = () => Array.from(navList.querySelectorAll('.navigation-link'));

  // Toggle navigation when button is clicked
  navButton.addEventListener('click', () => {
    const isOpen = navList.classList.contains('is-open');
    navList.classList.toggle('is-open');
    navButton.setAttribute('aria-expanded', !isOpen);
    
    // Focus first link when opening on mobile
    if (!isOpen && window.innerWidth <= 640) {
      setTimeout(() => {
        const links = getNavLinks();
        if (links[0]) links[0].focus();
      }, 100);
    }
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

  // Arrow key navigation - attach to document to catch all events
  document.addEventListener('keydown', (e) => {
    // Only handle arrow keys if focus is on a navigation link
    if (!e.target.classList.contains('navigation-link')) return;
    
    const links = getNavLinks().filter(link => !link.hasAttribute('aria-current'));
    const currentIndex = links.indexOf(e.target);
    
    if (currentIndex === -1) return;
    
    let targetIndex = currentIndex;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = links.length - 1;
    } else {
      return; // Not an arrow key we handle
    }
    
    if (links[targetIndex]) {
      links[targetIndex].focus();
    }
  });
})();
