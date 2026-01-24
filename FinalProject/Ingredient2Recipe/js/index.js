// index.js - Huvudfil för alla HTML-sidor
import { SearchResultsWidget } from './modules/search-widget.js';
import { RecipeDetailPage } from './modules/recipe-page.js';
import { WeeklyTipWidget } from './modules/weekly-tip.js';
import { mobileMenu, asideToggle } from './modules/ui-toggles.js';

// ========== init ==========
document.addEventListener('DOMContentLoaded', () => {
  // Mobilmenu-toggle
  mobileMenu();

  // Aside-toggle på search-sidan
  asideToggle();

  // Läser in rätt class baserat på vilket element som finns
  if (document.getElementById('recipe-grid')) {
    new WeeklyTipWidget();
  }

  if (document.getElementById('search-results-widget')) {
    new SearchResultsWidget('search-results-widget');
  }

  if (document.getElementById('recipe-article')) {
    new RecipeDetailPage();
  }

});
