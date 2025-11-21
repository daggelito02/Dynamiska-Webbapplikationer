// weekly-tips.js - Fetch weekly ingredient recipe and random recipe from TheMealDB
(async function() {
  const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
  
  // Helper function to safely extract text
  function safeText(str) {
    return String(str || "").replace(/[&<>"']/g, s => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&#34;",
      "'": "&#39;"
    }[s]));
  }

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
    if (!meal) return;

    const titleEl = document.getElementById(`${cardPrefix}-recipe-title`);
    const categoryEl = document.getElementById(`${cardPrefix}-recipe-category`);
    const descriptionEl = document.getElementById(`${cardPrefix}-recipe-description`);
    const linkEl = document.getElementById(`${cardPrefix}-recipe-link`);

    // Find the figure element by looking for the card
    const cardEl = document.getElementById(`${cardPrefix}-recipe-card`);
    const figureEl = cardEl ? cardEl.querySelector('.recipe-image') : null;

    // Set responsive image using a <picture> with default/medium/large
    if (figureEl) {
      const base = (meal.strMealThumb || '').replace(/\/(preview|medium|large)$/, '');
      const defaultSrc = base || '';
      const mediumSrc = base ? `${base}/medium` : '';
      const largeSrc = base ? `${base}/large` : '';

      // Build new picture element
      const picture = document.createElement('picture');

      if (defaultSrc) {
        const sDefault = document.createElement('source');
        sDefault.setAttribute('srcset', defaultSrc);
        sDefault.setAttribute('media', '(min-width:1024px)');
        picture.appendChild(sDefault);
      }

      if (largeSrc) {
        const sLarge = document.createElement('source');
        sLarge.setAttribute('srcset', largeSrc);
        sLarge.setAttribute('media', '(min-width:640px)');
        picture.appendChild(sLarge);
      }

      if (mediumSrc) {
        const sMedium = document.createElement('source');
        sMedium.setAttribute('srcset', mediumSrc);
        sMedium.setAttribute('media', '(min-width:350px)');
        picture.appendChild(sMedium);
      }

      // fallback img (uses medium size)
      const fallbackImg = document.createElement('img');
      fallbackImg.id = `${cardPrefix}-recipe-img`;
      fallbackImg.className = 'recipe-img';
      fallbackImg.src = mediumSrc || defaultSrc || (meal.strMealThumb || '');
      fallbackImg.alt = safeText(meal.strMeal || 'Recipe');
      picture.appendChild(fallbackImg);

      // Clear figure and insert new picture
      figureEl.innerHTML = '';
      figureEl.appendChild(picture);
    }

    // Set title
    if (titleEl) {
      titleEl.textContent = safeText(meal.strMeal || 'Unknown');
    }

    // Set category and area
    if (categoryEl) {
      const category = safeText(meal.strCategory || 'Unknown');
      const area = safeText(meal.strArea || 'Unknown');
      categoryEl.textContent = `${area} • ${category}`;
    }

    // Set description (use instructions or a snippet)
    if (descriptionEl) {
      const instructions = meal.strInstructions || '';
      const snippet = instructions.substring(0, 120) + (instructions.length > 120 ? '...' : '');
      descriptionEl.textContent = safeText(snippet);
    }

    // Set link to recipe page
    if (linkEl) {
      linkEl.href = `html/recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
    }

    // Return the link element so callers can move focus if needed
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
        if (randomCard) randomCard.classList.add('is-loading');
        newRandomBtn.disabled = true;
        newRandomBtn.setAttribute('aria-busy', 'true');

        const newMeal = await fetchRandomRecipe();
        if (newMeal) {
          const linkEl = renderRecipeCard(newMeal, 'random');
          // Move focus to the updated recipe link for accessibility
          if (linkEl) {
            // ensure it's focusable (anchor is focusable) and focus it
            linkEl.focus({ preventScroll: false });
          }
        }
      } catch (err) {
        console.error('Error fetching new random recipe:', err);
      } finally {
        if (randomCard) randomCard.classList.remove('is-loading');
        newRandomBtn.disabled = false;
        newRandomBtn.removeAttribute('aria-busy');
      }
    });
  }
})();
