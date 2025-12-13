// weekly-tips.js - Fetch weekly ingredient recipe and random recipe from TheMealDB
(async function() {
  const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

  // Fetch veckans recept med Banan (weekly ingredient)
  async function fetchWeeklyRecipe() {
    try {
      // Step 1: Get all recipes with banana
      const filterRes = await fetch(`${API_BASE}/filter.php?i=banana`);
      const filterData = await filterRes.json();
      
      if (!filterData.meals || filterData.meals.length === 0) {
        throw new Error('No meals found with banana');
      }

      // Step 2: Pick the first one (or could randomize)
      const mealId = filterData.meals[0].idMeal;
      
      // Step 3: Get full details
      const detailRes = await fetch(`${API_BASE}/lookup.php?i=${mealId}`);
      const detailData = await detailRes.json();
      
      if (!detailData.meals || detailData.meals.length === 0) {
        throw new Error('Meal details not found');
      }

      return detailData.meals[0];
    } catch (error) {
      console.error('Error fetching weekly recipe:', error);
      return null;
    }
  }

  // Fetch random recipe
  async function fetchRandomRecipe() {
    try {
      const res = await fetch(`${API_BASE}/random.php`);
      const data = await res.json();
      
      if (!data.meals || data.meals.length === 0) {
        throw new Error('Random meal not found');
      }

      return data.meals[0];
    } catch (error) {
      console.error('Error fetching random recipe:', error);
      return null;
    }
  }

  // Create recipe card element
  function createRecipeCard(meal, cardPrefix, headerText, showShuffleBtn = false) {
    const cardDiv = document.createElement('div');
    cardDiv.id = `${cardPrefix}-recipe-card`;
    cardDiv.className = 'recipe-card';
    cardDiv.setAttribute('aria-busy', 'false');

    // Header
    const header = document.createElement('h3');
    header.className = showShuffleBtn ? 'recipe-card-header random-header' : 'recipe-card-header';
    header.textContent = headerText;
    cardDiv.appendChild(header);

    // Shuffle button (only for random card)
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

    // Link
    const link = document.createElement('a');
    link.href = `html/recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
    link.className = 'recipe-link';
    link.id = `${cardPrefix}-recipe-link`;

    // Article
    const article = document.createElement('article');
    article.className = 'recipe-article';

    // Figure with picture
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

    // Recipe info div
    const infoDiv = document.createElement('div');
    infoDiv.className = 'recipe-info';

    // Title
    const title = document.createElement('h4');
    title.className = 'recipe-header';
    title.textContent = meal.strMeal || 'Okänt recept';
    title.lang = 'en';
    infoDiv.appendChild(title);

    // Category meta
    const category = document.createElement('p');
    category.className = 'recipe-meta';
    const categoryText = meal.strCategory || 'Okänd kategori';
    const areaText = meal.strArea || 'Okänt kök';
    category.textContent = `${areaText} • ${categoryText}`;
    category.lang = 'en';
    infoDiv.appendChild(category);

    // Description
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


  // Main execution
  const gridContainer = document.getElementById('recipe-grid');
  
  if (!gridContainer) {
    console.error('Recipe grid container not found');
    return;
  }

  const [weeklyMeal, randomMeal] = await Promise.all([
    fetchWeeklyRecipe(),
    fetchRandomRecipe()
  ]);

  // Create and append cards
  const weeklyCard = createRecipeCard(weeklyMeal, 'weekly', 'Denna veckas ingrediens: Banan', false);
  const randomCard = createRecipeCard(randomMeal, 'random', 'Slumpat fram ett recept', true);
  
  gridContainer.appendChild(weeklyCard);
  gridContainer.appendChild(randomCard);

  // Attach click handler to the shuffle button
  const newRandomBtn = document.getElementById('new-random-recipe-btn');

  if (newRandomBtn) {
    newRandomBtn.addEventListener('click', async () => {
      try {
        const randomCardEl = document.getElementById('random-recipe-card');
        
        if (randomCardEl) {
          randomCardEl.classList.add('is-loading');
          randomCardEl.setAttribute('aria-busy', 'true');
        }
        newRandomBtn.disabled = true;

        const newMeal = await fetchRandomRecipe();
        
        if (newMeal && randomCardEl) {
          const newCard = createRecipeCard(newMeal, 'random', 'Slumpat fram ett recept', true);
          randomCardEl.replaceWith(newCard);
          
          // Reattach event listener to new button
          const newBtn = document.getElementById('new-random-recipe-btn');
          if (newBtn) {
            newBtn.click = arguments.callee;
            newBtn.disabled = false;
          }
          
          // Focus on the link
          const link = newCard.querySelector('.recipe-link');
          if (link) {
            link.focus({ preventScroll: false });
          }
        }
      } catch (err) {
        console.error('Error fetching new random recipe:', err);
        newRandomBtn.disabled = false;
      }
    });
  }

})();
