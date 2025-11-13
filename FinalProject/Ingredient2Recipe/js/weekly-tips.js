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

    const imgEl = document.getElementById(`${cardPrefix}-recipe-img`);
    const titleEl = document.getElementById(`${cardPrefix}-recipe-title`);
    const categoryEl = document.getElementById(`${cardPrefix}-recipe-category`);
    const descriptionEl = document.getElementById(`${cardPrefix}-recipe-description`);
    const linkEl = document.getElementById(`${cardPrefix}-recipe-link`);

    // Set image
    if (imgEl) {
      imgEl.src = meal.strMealThumb || '';
      imgEl.alt = safeText(meal.strMeal || 'Recipe');
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
  }

  // Main execution
  const [weeklyMeal, randomMeal] = await Promise.all([
    fetchWeeklyRecipe(),
    fetchRandomRecipe()
  ]);

  renderRecipeCard(weeklyMeal, 'weekly');
  renderRecipeCard(randomMeal, 'random');
})();
