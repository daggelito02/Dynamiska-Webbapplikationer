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

  // Render recipe card
  function renderRecipeCard(meal, cardPrefix) {
  const cardEl = document.getElementById(`${cardPrefix}-recipe-card`);

  // Om vi inte får något meal, visa ett enkelt felmeddelande
  if (!meal) {
    if (cardEl) {
      cardEl.setAttribute('aria-busy', 'false');
      const descriptionEl = cardEl.querySelector('.recipe-text');
      if (descriptionEl) {
        descriptionEl.textContent = 'Kunde inte ladda recept just nu.';
      }
    }
    return;
  }

  const titleEl = document.getElementById(`${cardPrefix}-recipe-title`);
  const categoryEl = document.getElementById(`${cardPrefix}-recipe-category`);
  const descriptionEl = document.getElementById(`${cardPrefix}-recipe-description`);
  const linkEl = document.getElementById(`${cardPrefix}-recipe-link`);
  const figureEl = cardEl ? cardEl.querySelector('.recipe-image') : null;

  // Bild / <picture>
  if (figureEl) {
    const thumb = meal.strMealThumb || '';
    const base = thumb.replace(/\/(preview|medium|large)$/, '');
    const defaultSrc = base || thumb || '';
    const mediumSrc = base ? `${base}/medium` : thumb;
    const largeSrc  = base ? `${base}/large`  : '';

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

    const fallbackImg = document.createElement('img');
    fallbackImg.id = `${cardPrefix}-recipe-img`;
    fallbackImg.className = 'recipe-img';
    fallbackImg.src = mediumSrc || defaultSrc;
    fallbackImg.alt = meal.strMeal || 'Recept';

    picture.appendChild(fallbackImg);

    figureEl.innerHTML = '';
    figureEl.appendChild(picture);
  }

  // Titel
  if (titleEl) {
    titleEl.textContent = meal.strMeal || 'Okänt recept';
  }

  // Kategori + area
  if (categoryEl) {
    const category = meal.strCategory || 'Okänd kategori';
    const area = meal.strArea || 'Okänt kök';
    categoryEl.textContent = `${area} • ${category}`;
  }

  // Beskrivning – visa hela instruktionen
  if (descriptionEl) {
    descriptionEl.textContent = meal.strInstructions || '';
  }

  // Länk
  if (linkEl) {
    linkEl.href = `html/recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
    linkEl.removeAttribute('aria-disabled');
    linkEl.removeAttribute('tabindex');
  }

  if (cardEl) {
    cardEl.setAttribute('aria-busy', 'false');
  }

  return linkEl;
}


  // Main execution
  const [weeklyMeal, randomMeal] = await Promise.all([
    fetchWeeklyRecipe(),
    fetchRandomRecipe()
  ]);

  renderRecipeCard(weeklyMeal, 'weekly');
  renderRecipeCard(randomMeal, 'random');

  // Attach click handler to the "new random recipe" button so it fetches a new random recipe
  const newRandomBtn = document.getElementById('new-random-recipe-btn');
  const randomCard = document.getElementById('random-recipe-card');

  if (newRandomBtn) {
    newRandomBtn.addEventListener('click', async (ev) => {
      try {
        // visual loading state on the card and button
        if (randomCard) {
          randomCard.classList.add('is-loading');
          randomCard.setAttribute('aria-busy', 'true');
        }
        newRandomBtn.disabled = true;

        const newMeal = await fetchRandomRecipe();
        if (newMeal) {
          const linkEl = renderRecipeCard(newMeal, 'random');
          // Move focus to the updated recipe link for accessibility
          if (linkEl) {
            linkEl.focus({ preventScroll: false });
          }
        }
      } catch (err) {
        console.error('Error fetching new random recipe:', err);
      } finally {
        if (randomCard) {
          randomCard.classList.remove('is-loading');
          randomCard.setAttribute('aria-busy', 'false');
        }
        newRandomBtn.disabled = false;
      }
    });
  }

})();
