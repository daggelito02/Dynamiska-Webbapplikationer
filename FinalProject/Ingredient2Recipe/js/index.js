// index.js - Huvudfil för alla HTML-sidor
import { SearchResultsWidget } from './modules/search-widget.js';
import { RecipeDetailPage } from './modules/recipe-page.js';
import { WeeklyTipWidget } from './modules/weekly-tip.js';

// ========== NAV TOGGLE FUNKTIONALITET ==========
function initNavToggle() {
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navList = document.querySelector('.navigation-list');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('is-open');
  });
}

// ========== ASIDE TOGGLE (för search.html) ==========
function initAsideToggle() {
  const toggleBtn = document.getElementById('search-info-toggle');
  const infoContainer = document.getElementById('search-info');
  
  if (!toggleBtn || !infoContainer) return;
  
  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    infoContainer.classList.toggle('open');
  });
}

// ========== INITIALISERING ==========
document.addEventListener('DOMContentLoaded', () => {
  // Nav-toggle fungerar på alla sidor
  initNavToggle();

  // Aside-toggle för search-sidan
  initAsideToggle();

  // Initiera rätt widget baserat på vilka element som finns
  if (document.getElementById('search-results-widget')) {
    new SearchResultsWidget('search-results-widget');
  }

  if (document.getElementById('recipe-article')) {
    new RecipeDetailPage();
  }

  if (document.getElementById('recipe-grid')) {
    new WeeklyTipWidget();
  }
});
