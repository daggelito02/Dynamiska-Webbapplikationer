// search-widget.js - SearchResultsWidget klass
import { RecipeAPI } from './recipe-api.js';

export class SearchResultsWidget {
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
    // Lyssna på form knappen
    this.form.addEventListener('submit', (e) => this.handleSearch(e));
  }
  // Skapar sökresultatet på sidan
  createResultsSection() {
    if (this.resultsSection) return; // Skapa bara en gång
    
    this.resultsSection = document.createElement('section');
    this.resultsSection.className = 'search-results';
    this.resultsSection.setAttribute('aria-live', 'polite');
    this.resultsSection.id = 'results';
    this.resultsSection.setAttribute('aria-labelledby', 'results-title');
    this.resultsSection.setAttribute('aria-busy', 'false');
    
    const title = document.createElement('h2');
    title.id = 'results-title';
    title.textContent = 'Sökresultat:';
    this.resultsSection.appendChild(title);
    
    const ul = document.createElement('ul');
    ul.id = 'search-list';
    ul.className = 'search-list';
    this.resultsSection.appendChild(ul);
    
    this.container.appendChild(this.resultsSection);
  }

  // Hanterar sökningen
  async handleSearch(e) {
    e.preventDefault();
    const input = this.form.querySelector('#q');
    const query = input.value.trim();

    if (!query) return;

    this.createResultsSection(); // Skapa sektion vid första sökningen
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

  // Visar laddningsmeddelande
  showLoading() {
    const ul = this.resultsSection.querySelector('#search-list');
    this.resultsSection.setAttribute('aria-busy', 'true');
    ul.innerHTML = '<li class="loading-message">Söker recept...</li>';
  }

  // Visar felmeddelande
  showError(message) {
    const ul = this.resultsSection.querySelector('#search-list');
    this.resultsSection.setAttribute('aria-busy', 'false');
    ul.innerHTML = `<li class="error-message">${message}</li>`;
  }

  // Visar sökresultat
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
