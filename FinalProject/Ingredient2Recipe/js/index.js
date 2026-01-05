// index.js - Huvudfil för alla HTML-sidor
import { SearchResultsWidget } from './modules/search-widget.js';
import { RecipeDetailPage } from './modules/recipe-page.js';
import { WeeklyTipWidget } from './modules/weekly-tip.js';
import { initNavToggle, initAsideToggle } from './modules/ui-helpers.js';

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
