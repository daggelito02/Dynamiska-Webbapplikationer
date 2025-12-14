// widget-ui.js - UI modul för att skapa och hantera widget-element
export class RecipeWidgetUI {
  constructor(containerId) {
    // containerId är nu optional - elementet kan sättas senare
    if (containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Container med id "${containerId}" hittades inte`);
      }
    }
  }

  /**
   * Skapa sökformulär
   * @returns {HTMLFormElement}
   */
  createSearchForm() {
    const form = document.createElement('form');
    form.className = 'search-form';
    form.id = 'ingredient-form';
    form.setAttribute('aria-label', 'Receptsökning på ingrediensens namn');

    const intro1 = document.createElement('p');
    intro1.textContent = 'För att få bästa resultat, skriv in ingrediensens namn på engelska.';
    form.appendChild(intro1);

    const intro2 = document.createElement('p');
    intro2.innerHTML = 'Exempel: <kbd>salt</kbd>, <kbd>beef</kbd>, <kbd>noodles</kbd>.';
    form.appendChild(intro2);

    const label = document.createElement('label');
    label.className = 'search-form-label';
    label.htmlFor = 'q';
    label.textContent = 'Sök:';
    form.appendChild(label);

    const input = document.createElement('input');
    input.className = 'search-form-type-text';
    input.id = 'q';
    input.name = 'q';
    input.type = 'text';
    input.required = true;
    input.placeholder = 'Skriv en ingrediens, t.ex. flour';
    input.setAttribute('aria-describedby', 'help');
    form.appendChild(input);

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Sök recept';
    form.appendChild(button);

    const help = document.createElement('p');
    help.className = 'search-form-help';
    help.id = 'help';
    const small = document.createElement('small');
    small.textContent = 'Sökningen kan innehålla bokstäver och mellanslag. Tomt fält tillåts inte.';
    help.appendChild(small);
    form.appendChild(help);

    return form;
  }

  /**
   * Skapa info-aside med toggle-knapp
   * @returns {HTMLElement}
   */
  createInfoAside() {
    const aside = document.createElement('aside');
    aside.className = 'search-aside';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.id = 'search-info-toggle';
    toggleBtn.className = 'search-info-toggle';
    toggleBtn.setAttribute('aria-controls', 'search-info');
    toggleBtn.setAttribute('aria-expanded', 'false');

    const btnText = document.createElement('span');
    btnText.className = 'search-button-text';
    btnText.textContent = 'Om sökfunktionen';

    const downArrow = document.createElement('span');
    downArrow.setAttribute('aria-hidden', 'true');
    downArrow.className = 'material-symbols-outlined search-arrow search-arrow-down';
    downArrow.textContent = 'keyboard_arrow_down';

    const upArrow = document.createElement('span');
    upArrow.setAttribute('aria-hidden', 'true');
    upArrow.className = 'material-symbols-outlined search-arrow search-arrow-up';
    upArrow.textContent = 'keyboard_arrow_up';

    btnText.appendChild(downArrow);
    btnText.appendChild(upArrow);
    toggleBtn.appendChild(btnText);
    aside.appendChild(toggleBtn);

    const infoContainer = document.createElement('div');
    infoContainer.id = 'search-info';
    infoContainer.className = 'search-info-text-container aside-card';

    const h2 = document.createElement('h2');
    h2.className = 'search-info-header';
    h2.textContent = 'Om sökfunktionen';
    infoContainer.appendChild(h2);

    const p1 = document.createElement('p');
    p1.className = 'search-text-info';
    p1.textContent = 'Här kan du söka fram en lista med recept baserade på den ingrediens du vill ska ingå i receptet.';
    infoContainer.appendChild(p1);

    const p2 = document.createElement('p');
    p2.className = 'search-text-info';
    p2.textContent = 'Tanken är att du kanske är sugen på en speciell råvara och vill se om det finns recept med just den ingrediensen, eller att du helt enkelt behöver laga något av den innan den blir för gammal.';
    infoContainer.appendChild(p2);

    const p3 = document.createElement('p');
    p3.className = 'search-text-info';
    p3.textContent = 'Det finns som sagt många olika anledningar till varför det kan vara en bra idé att söka på ingredienser.';
    infoContainer.appendChild(p3);

    aside.appendChild(infoContainer);

    return aside;
  }

  /**
   * Skapa sökresultat-sektion
   * @returns {HTMLElement}
   */
  createResultsSection() {
    const section = document.createElement('section');
    section.className = 'search-results';
    section.setAttribute('aria-live', 'polite');
    section.id = 'results';
    section.setAttribute('aria-labelledby', 'results-title');

    const h2 = document.createElement('h2');
    h2.id = 'results-title';
    h2.textContent = 'Sökresultat';
    section.appendChild(h2);

    const ul = document.createElement('ul');
    ul.id = 'search-list';
    ul.className = 'search-list';
    section.appendChild(ul);

    return section;
  }

  /**
   * Skapa receptkort för sökresultat
   * @param {Object} meal - Receptdata från API
   * @returns {HTMLLIElement}
   */
  createRecipeCard(meal) {
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = `recipe.html?id=${meal.idMeal}`;
    link.className = 'search-result-link';

    const article = document.createElement('article');
    article.className = 'search-result-article';

    // Header med titel
    const header = document.createElement('header');
    header.className = 'search-result-header';
    const h3 = document.createElement('h3');
    h3.textContent = meal.strMeal || 'Okänt recept';
    h3.lang = 'en';
    header.appendChild(h3);
    article.appendChild(header);

    // Textinnehåll
    const body = document.createElement('div');
    body.className = 'search-result-text-content';

    const instructions = meal.strInstructions || '';
    if (instructions) {
      const previewP = document.createElement('p');
      previewP.className = 'search-result-preview-text';
      previewP.setAttribute('aria-hidden', 'true');
      previewP.lang = 'en';
      previewP.textContent = instructions;
      body.appendChild(previewP);
    }

    // Footer med metadata
    const footer = document.createElement('footer');
    footer.className = 'search-result-meta';
    const small = document.createElement('small');
    const area = meal.strArea || '';
    const category = meal.strCategory || '';
    small.textContent = area
      ? category
        ? `${area} • ${category}`
        : area
      : category;
    small.lang = 'en';
    footer.appendChild(small);
    body.appendChild(footer);

    article.appendChild(body);

    // Bild
    const img = document.createElement('img');
    img.className = 'search-list-img';
    const thumb = meal.strMealThumb || '';
    img.src = thumb ? `${thumb}/preview` : '';
    img.alt = `Foto av rätten ${meal.strMeal || ''}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    article.appendChild(img);

    link.appendChild(article);
    li.appendChild(link);

    return li;
  }

  /**
   * Visa laddningsmeddelande
   */
  showLoading() {
    const list = document.getElementById('search-list');
    if (list) {
      list.innerHTML = '<li>Laddar recept...</li>';
    }
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
      resultsSection.setAttribute('aria-busy', 'true');
    }
  }

  /**
   * Dölj laddningsindikator
   */
  hideLoading() {
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
      resultsSection.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Visa felmeddelande
   * @param {string} message - Felmeddelande att visa
   */
  showError(message) {
    const list = document.getElementById('search-list');
    if (list) {
      list.innerHTML = `<li>${message}</li>`;
    }
    this.hideLoading();
  }

  /**
   * Visa sökresultat
   * @param {Array} meals - Array med receptdata
   */
  showResults(meals) {
    const list = document.getElementById('search-list');
    if (!list) return;

    if (!meals || meals.length === 0) {
      this.showError('Inga träffar. Testa ett annat sökord.');
      return;
    }

    list.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    meals.forEach(meal => {
      const card = this.createRecipeCard(meal);
      fragment.appendChild(card);
    });

    list.appendChild(fragment);
    this.hideLoading();
  }

  /**
   * Sätt upp toggle-funktionalitet för info-aside
   */
  setupInfoToggle() {
    const toggleBtn = document.getElementById('search-info-toggle');
    const aside = document.getElementById('search-info');

    if (!toggleBtn || !aside) return;

    const downArrow = toggleBtn.querySelector('.search-arrow-down');
    const upArrow = toggleBtn.querySelector('.search-arrow-up');

    const setClosedVisual = () => {
      if (downArrow) downArrow.style.display = 'inline';
      if (upArrow) upArrow.style.display = 'none';
    };

    const setOpenVisual = () => {
      if (downArrow) downArrow.style.display = 'none';
      if (upArrow) upArrow.style.display = 'inline';
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = aside.classList.contains('open');
      aside.classList.toggle('open');
      const nowOpen = !isOpen;
      toggleBtn.setAttribute('aria-expanded', String(nowOpen));
      if (nowOpen) setOpenVisual();
      else setClosedVisual();
    });

    aside.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        aside.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        setClosedVisual();
        toggleBtn.focus();
      }
    });
  }
}
