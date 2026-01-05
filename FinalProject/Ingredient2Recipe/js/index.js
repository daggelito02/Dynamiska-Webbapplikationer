// index.js - Huvudfil för alla HTML-sidor
import { RecipeAPI } from './modules/recipe-api.js';
import { SearchResultsWidget } from './modules/search-widget.js';
import { RecipeDetailPage } from './modules/recipe-page.js';

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

// ========== WEEKLY TIPS WIDGET (för index.html) ==========
class WeeklyTipsWidget {
  constructor() {
    this.api = new RecipeAPI();
    this.gridContainer = document.getElementById('recipe-grid');
    this.WEEKLY_HEADER = 'Denna veckas ingrediens: Banan';
    this.RANDOM_HEADER = 'Slumpa recept? Klicka på symbolen';
    
    if (this.gridContainer) {
      this.init();
    }
  }

  async init() {
    const [weeklyMeal, randomMeal] = await Promise.all([
      this.api.getFirstByIngredient('banana'),
      this.api.getRandomMeal()
    ]);

    const weeklyCard = this.createRecipeCard(weeklyMeal, 'weekly', this.WEEKLY_HEADER, false);
    const randomCard = this.createRecipeCard(randomMeal, 'random', this.RANDOM_HEADER, true);

    this.gridContainer.appendChild(weeklyCard);
    this.gridContainer.appendChild(randomCard);

    this.setupShuffleButton();
  }

  createRecipeCard(meal, cardPrefix, headerText, showShuffleBtn = false) {
    const cardDiv = document.createElement('div');
    cardDiv.id = `${cardPrefix}-recipe-card`;
    cardDiv.className = 'recipe-card';
    cardDiv.setAttribute('aria-busy', 'false');

    const header = document.createElement('h3');
    header.className = showShuffleBtn ? 'recipe-card-header random-header' : 'recipe-card-header';
    header.textContent = headerText;
    cardDiv.appendChild(header);

    if (showShuffleBtn) {
      const shuffleBtn = document.createElement('button');
      shuffleBtn.type = 'button';
      shuffleBtn.className = 'random-btn';
      shuffleBtn.id = 'new-random-recipe-btn';
      shuffleBtn.setAttribute('aria-label', 'Hämta nytt slumpat recept');

      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = 'shuffle';

      shuffleBtn.appendChild(icon);
      cardDiv.appendChild(shuffleBtn);
    }

    if (!meal) {
      const errorP = document.createElement('p');
      errorP.textContent = 'Kunde inte ladda recept just nu.';
      cardDiv.appendChild(errorP);
      return cardDiv;
    }

    const link = document.createElement('a');
    link.href = `html/recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
    link.className = 'recipe-link';

    const article = document.createElement('article');
    article.className = 'recipe-article';

    const figure = document.createElement('figure');
    figure.className = 'recipe-image';

    const thumb = meal.strMealThumb || '';
    const base = thumb.replace(/\/(preview|medium|large)$/, '');
    const defaultSrc = base || thumb || '';
    const mediumSrc = base ? `${base}/medium` : thumb;
    const largeSrc = base ? `${base}/large` : '';

    const picture = document.createElement('picture');

    if (largeSrc) {
      const sLarge = document.createElement('source');
      sLarge.setAttribute('srcset', largeSrc);
      sLarge.setAttribute('media', '(min-width:1024px)');
      picture.appendChild(sLarge);
    }

    if (defaultSrc) {
      const sDefault = document.createElement('source');
      sDefault.setAttribute('srcset', defaultSrc);
      sDefault.setAttribute('media', '(min-width:640px)');
      picture.appendChild(sDefault);
    }

    if (mediumSrc) {
      const sMedium = document.createElement('source');
      sMedium.setAttribute('srcset', mediumSrc);
      sMedium.setAttribute('media', '(min-width:350px)');
      picture.appendChild(sMedium);
    }

    const img = document.createElement('img');
    img.className = 'recipe-img';
    img.src = mediumSrc || defaultSrc;
    img.alt = meal.strMeal || 'Recept';

    picture.appendChild(img);
    figure.appendChild(picture);
    article.appendChild(figure);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'recipe-info';

    const title = document.createElement('h4');
    title.className = 'recipe-header';
    title.textContent = meal.strMeal || 'Okänt recept';
    title.lang = 'en';
    infoDiv.appendChild(title);

    const category = document.createElement('p');
    category.className = 'recipe-meta';
    const categoryText = meal.strCategory || 'Okänd kategori';
    const areaText = meal.strArea || 'Okänt kök';
    category.textContent = `${areaText} • ${categoryText}`;
    category.lang = 'en';
    infoDiv.appendChild(category);

    const description = document.createElement('p');
    description.className = 'recipe-text';
    description.textContent = meal.strInstructions || '';
    description.lang = 'en';
    infoDiv.appendChild(description);

    article.appendChild(infoDiv);
    link.appendChild(article);
    cardDiv.appendChild(link);

    return cardDiv;
  }

  setupShuffleButton() {
    const handleShuffleClick = async () => {
      try {
        const randomCardEl = document.getElementById('random-recipe-card');
        const btn = document.getElementById('new-random-recipe-btn');

        if (randomCardEl) {
          randomCardEl.classList.add('is-loading');
          randomCardEl.setAttribute('aria-busy', 'true');
        }
        if (btn) {
          btn.disabled = true;
        }

        const newMeal = await this.api.getRandomMeal();

        if (newMeal && randomCardEl) {
          const newCard = this.createRecipeCard(newMeal, 'random', this.RANDOM_HEADER, true);
          randomCardEl.replaceWith(newCard);

          const newBtn = document.getElementById('new-random-recipe-btn');
          if (newBtn) {
            newBtn.addEventListener('click', handleShuffleClick);
            newBtn.disabled = false;
          }

          const link = newCard.querySelector('.recipe-link');
          if (link) {
            link.focus({ preventScroll: false });
          }
        }
      } catch (err) {
        console.error('Error fetching new random recipe:', err);
        const btn = document.getElementById('new-random-recipe-btn');
        if (btn) {
          btn.disabled = false;
        }
      }
    };

    const newRandomBtn = document.getElementById('new-random-recipe-btn');
    if (newRandomBtn) {
      newRandomBtn.addEventListener('click', handleShuffleClick);
    }
  }
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
    new WeeklyTipsWidget();
  }
});
