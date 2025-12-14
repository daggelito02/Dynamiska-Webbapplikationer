// index.js - Huvudfil för alla HTML-sidor
import { RecipeAPI } from './widget-api.js';

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

// ========== SEARCH WIDGET (för search.html) ==========
class SearchResultsWidget {
  constructor(containerId) {
    this.api = new RecipeAPI();
    this.container = document.getElementById(containerId);
    this.form = document.getElementById('ingredient-form');
    this.resultsSection = null;
    
    if (this.container && this.form) {
      this.init();
    }
  }

  init() {
    // Skapa results-sektionen
    this.resultsSection = document.createElement('section');
    this.resultsSection.className = 'search-results';
    this.resultsSection.setAttribute('aria-live', 'polite');
    this.resultsSection.id = 'results';
    this.resultsSection.setAttribute('aria-labelledby', 'results-title');
    this.resultsSection.setAttribute('aria-busy', 'false');
    
    const title = document.createElement('h2');
    title.id = 'results-title';
    title.textContent = 'Sökresultat';
    this.resultsSection.appendChild(title);
    
    const ul = document.createElement('ul');
    ul.id = 'search-list';
    ul.className = 'search-list';
    this.resultsSection.appendChild(ul);
    
    this.container.appendChild(this.resultsSection);
    
    // Lyssna på form submit
    this.form.addEventListener('submit', (e) => this.handleSearch(e));
  }

  async handleSearch(e) {
    e.preventDefault();
    const input = this.form.querySelector('#q');
    const query = input.value.trim();

    if (!query) return;

    this.showLoading();

    try {
      const meals = await this.api.searchByIngredient(query);
      
      if (meals && meals.length > 0) {
        this.showResults(meals);
      } else {
        this.showError(`Inga recept hittades med "${query}". Prova en annan ingrediens (på engelska).`);
      }
    } catch (error) {
      console.error('Search error:', error);
      this.showError('Något gick fel vid sökningen. Försök igen.');
    }
  }

  showLoading() {
    const ul = this.resultsSection.querySelector('#search-list');
    this.resultsSection.setAttribute('aria-busy', 'true');
    ul.innerHTML = '<li class="loading-message">Söker recept...</li>';
  }

  showError(message) {
    const ul = this.resultsSection.querySelector('#search-list');
    this.resultsSection.setAttribute('aria-busy', 'false');
    ul.innerHTML = `<li class="error-message">${message}</li>`;
  }

  showResults(meals) {
    const ul = this.resultsSection.querySelector('#search-list');
    this.resultsSection.setAttribute('aria-busy', 'false');
    ul.innerHTML = '';

    meals.forEach(meal => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `recipe.html?id=${meal.idMeal}`;
      link.className = 'search-result-link';

      const article = document.createElement('article');
      article.className = 'search-result-article';

      const header = document.createElement('header');
      header.className = 'search-result-header';
      const h3 = document.createElement('h3');
      h3.textContent = meal.strMeal;
      h3.lang = 'en';
      header.appendChild(h3);
      article.appendChild(header);

      const textContent = document.createElement('div');
      textContent.className = 'search-result-text-content';

      const preview = document.createElement('p');
      preview.className = 'search-result-preview-text';
      preview.setAttribute('aria-hidden', 'true');
      preview.textContent = meal.strInstructions || '';
      preview.lang = 'en';
      textContent.appendChild(preview);

      const footer = document.createElement('footer');
      footer.className = 'search-result-meta';
      const small = document.createElement('small');
      small.textContent = `${meal.strArea || 'Unknown'} • ${meal.strCategory || 'Unknown'}`;
      small.lang = 'en';
      footer.appendChild(small);
      textContent.appendChild(footer);

      article.appendChild(textContent);

      const img = document.createElement('img');
      img.className = 'search-list-img';
      img.src = meal.strMealThumb ? `${meal.strMealThumb}/small` : '';
      img.alt = `Foto av rätten ${meal.strMeal}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      article.appendChild(img);

      link.appendChild(article);
      li.appendChild(link);
      ul.appendChild(li);
    });
  }
}

// ========== RECIPE DETAIL PAGE (för recipe.html) ==========
class RecipeDetailPage {
  constructor() {
    this.api = new RecipeAPI();
    this.init();
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    const mealId = params.get('id');

    if (!mealId) {
      this.showError('Inget recept valt');
      return;
    }

    try {
      const meal = await this.api.getMealDetails(mealId);
      if (meal) {
        this.renderRecipe(meal);
      } else {
        this.showError('Receptet kunde inte hittas');
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      this.showError('Något gick fel vid laddning av receptet');
    }
  }

  renderRecipe(meal) {
    const titleEl = document.getElementById('recipe-title');
    const articleEl = document.getElementById('recipe-article');

    if (titleEl) {
      titleEl.textContent = meal.strMeal || 'Okänt recept';
      titleEl.lang = 'en';
    }

    if (articleEl) {
      articleEl.innerHTML = '';
      
      // Skapa overview-div med picture + meta
      const overviewDiv = document.createElement('div');
      overviewDiv.className = 'recipe-overview';
      
      const picture = this.createPicture(meal);
      const meta = this.createMeta(meal);
      
      overviewDiv.appendChild(picture);
      overviewDiv.appendChild(meta);
      articleEl.appendChild(overviewDiv);
      
      // Skapa text-content-div med ingredients + instructions
      const textContentDiv = document.createElement('div');
      textContentDiv.className = 'recipe-text-content';
      
      const ingredients = this.createIngredients(meal);
      const instructions = this.createInstructions(meal);
      
      textContentDiv.appendChild(ingredients);
      textContentDiv.appendChild(instructions);
      articleEl.appendChild(textContentDiv);
    }
  }

  createPicture(meal) {
    const thumb = meal.strMealThumb || '';
    const base = thumb.replace(/\/(preview|medium|large)$/, '');
    const defaultSrc = base || thumb || '';
    const mediumSrc = base ? `${base}/medium` : thumb;
    const largeSrc = base ? `${base}/large` : '';

    const picture = document.createElement('picture');
    picture.className = 'recipe-picture';

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
    img.alt = `Foto av rätten ${meal.strMeal || 'recept'}`;

    picture.appendChild(img);

    return picture;
  }

  createMeta(meal) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'recipe-meta';

    const category = document.createElement('p');
    category.innerHTML = `<strong>Kategori:</strong><span lang="en"> ${meal.strCategory || 'Okänd'}</span>`;
    metaDiv.appendChild(category);

    const area = document.createElement('p');
    area.innerHTML = `<strong>Kök:</strong><span lang="en"> ${meal.strArea || 'Okänd'}</span>`;
    metaDiv.appendChild(area);

    if (meal.strTags) {
      const tags = document.createElement('p');
      tags.innerHTML = `<strong>Taggar:</strong><span lang="en"> ${meal.strTags}</span>`;
      metaDiv.appendChild(tags);
    }

    return metaDiv;
  }

  createIngredients(meal) {
    const div = document.createElement('div');
    div.className = 'recipe-ingredients';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Ingredienser';
    div.appendChild(heading);

    const ul = document.createElement('ul');
    ul.className = 'recipe-ingredients-list';

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        const li = document.createElement('li');
        li.lang = 'en';
        li.textContent = `${ingredient} – ${measure || ''}`.trim();
        ul.appendChild(li);
      }
    }

    div.appendChild(ul);
    return div;
  }

  createInstructions(meal) {
    const div = document.createElement('div');
    div.className = 'recipe-instructions';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Instruktioner';
    div.appendChild(heading);

    const ol = document.createElement('ol');
    ol.className = 'recipe-instructions-list';

    // Dela upp instruktionerna i steg (baserat på radbrytningar)
    const instructionsText = meal.strInstructions || 'Inga instruktioner tillgängliga.';
    const steps = instructionsText.split('\n').filter(step => step.trim());

    steps.forEach(step => {
      const li = document.createElement('li');
      li.lang = 'en';
      li.textContent = step.trim();
      ol.appendChild(li);
    });

    div.appendChild(ol);

    // Lägg till länkar om de finns
    if (meal.strYoutube || meal.strSource) {
      const linksDiv = document.createElement('div');
      linksDiv.className = 'recipe-links';

      if (meal.strYoutube) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.className = 'new-window';
        a.href = meal.strYoutube;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Se video på YouTube';
        
        const span = document.createElement('span');
        span.className = 'visually-hidden';
        span.textContent = '(öppnas i ny flik)';
        a.appendChild(span);
        
        p.appendChild(a);
        linksDiv.appendChild(p);
      }

      if (meal.strSource) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.className = 'new-window';
        a.href = meal.strSource;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Källa';
        
        const span = document.createElement('span');
        span.className = 'visually-hidden';
        span.textContent = '(öppnas i ny flik)';
        a.appendChild(span);
        
        p.appendChild(a);
        linksDiv.appendChild(p);
      }

      div.appendChild(linksDiv);
    }

    return div;
  }

  showError(message) {
    const titleEl = document.getElementById('recipe-title');
    const articleEl = document.getElementById('recipe-article');

    if (titleEl) {
      titleEl.textContent = 'Fel vid laddning';
    }

    if (articleEl) {
      articleEl.innerHTML = `<p class="error-message">${message}</p>`;
    }
  }
}

// ========== WEEKLY TIPS WIDGET (för index.html) ==========
class WeeklyTipsWidget {
  constructor() {
    this.api = new RecipeAPI();
    this.gridContainer = document.getElementById('recipe-grid');
    
    if (this.gridContainer) {
      this.init();
    }
  }

  async init() {
    const [weeklyMeal, randomMeal] = await Promise.all([
      this.api.getFirstByIngredient('banana'),
      this.api.getRandomMeal()
    ]);

    const weeklyCard = this.createRecipeCard(weeklyMeal, 'weekly', 'Denna veckas ingrediens: Banan', false);
    const randomCard = this.createRecipeCard(randomMeal, 'random', 'Slumpat fram ett recept', true);

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
          const newCard = this.createRecipeCard(newMeal, 'random', 'Slumpat fram ett recept', true);
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
