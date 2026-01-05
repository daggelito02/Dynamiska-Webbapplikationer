// recipe-page.js - RecipeDetailPage klass
import { RecipeAPI } from './recipe-api.js';

export class RecipeDetailPage {
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
