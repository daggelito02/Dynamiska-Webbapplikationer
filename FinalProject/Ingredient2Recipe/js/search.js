
// search.js - builds search page results from TheMealDB by meal name using search.php?s=
(function(){
  const form = document.getElementById('ingredient-form') || document.querySelector('form[role="search"]');
  const input = document.getElementById('q');
  const grid = document.getElementById('result-grid');

  function safeText(str){
    return String(str || "").replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&#34;","'":"&#39;"
    }[s]));
  }

  function card(meal){
    const a = document.createElement('a');
    a.href = `recipe.html?id=${meal.idMeal}`;
    a.className = 'search-result-list';
    a.setAttribute('aria-label', `Visa recept: ${meal.strMeal}`);
    
    // Extract snippet from instructions if available
    const instructions = meal.strInstructions || '';
    const snippet = instructions.substring(0, 500) + (instructions.length > 100 ? '...' : '');
    
    a.innerHTML = `
      <h3 class="search-result-header">${safeText(meal.strMeal)}</h3>
      <div class="search-result-instructions">
        <p> 
          ${snippet ? `${safeText(snippet)}` : ''}
        </p>
        <footer class="search-result-meta">
          <small>${safeText(meal.strArea || "")} ${meal.strCategory ? "• " + safeText(meal.strCategory) : ""}</small>
        </footer>
      </div>
      <img class="search-list-img" src="${meal.strMealThumb}/small" alt="Foto av rätten ${safeText(meal.strMeal)}">
     
    `;
    return a;
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    grid.innerHTML = "";
    const q = input.value.trim();
    if(q.length === 0){
      grid.innerHTML = "<p>Ange något att söka på.</p>";
      input.focus();
      return;
    }
    try{
      // Step 1: Get filtered list by ingredient
      const filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(q)}`;
      const filterRes = await fetch(filterUrl);
      const filterData = await filterRes.json();
      
      if(!filterData.meals){
        grid.innerHTML = "<p>Inga träffar. Testa ett annat sökord.</p>";
        return;
      }
      
      // Step 2: Fetch full details for each meal (limited to 12 for performance)
      grid.innerHTML = "<p>Laddar recept...</p>";
      const mealPromises = filterData.meals.slice(0, 12).map(meal => 
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
          .then(r => r.json())
          .then(data => data.meals?.[0])
          .catch(() => null) // Handle individual failures
      );
      
      const fullMeals = await Promise.all(mealPromises);
      
      // Step 3: Render cards with full data
      grid.innerHTML = "";
      const frag = document.createDocumentFragment();
      fullMeals.filter(Boolean).forEach(m => frag.appendChild(card(m)));
      grid.appendChild(frag);
    }catch(err){
      grid.innerHTML = "<p>Kunde inte hämta data just nu.</p>";
      console.error(err);
    }
  });
})();
