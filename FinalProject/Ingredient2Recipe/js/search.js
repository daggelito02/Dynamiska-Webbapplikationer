
// search.js - builds search page results from TheMealDB by meal name using search.php?s=
(function(){
  const form = document.getElementById('ingredient-form') || document.querySelector('form[role="search"]');
  const input = document.getElementById('q');
  const grid = document.getElementById('search-list');
  const resultsSection = document.getElementById('results');

  function safeText(str){
    return String(str || "").replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&#34;","'":"&#39;"
    }[s]));
  }

  function card(meal){
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = `recipe.html?id=${meal.idMeal}`;
    link.className = 'search-result-link';
    link.setAttribute('aria-label', `Visa recept: ${meal.strMeal}`);

    const article = document.createElement('article');
    article.className = 'search-result-article';

    const header = document.createElement('header');
    header.className = 'search-result-header';
    const h3 = document.createElement('h3');
    h3.textContent = safeText(meal.strMeal);
    header.appendChild(h3);

    const body = document.createElement('div');
    body.className = 'search-result-text-content';

    const instructions = meal.strInstructions || '';
    if(instructions){
      const previewP = document.createElement('p');
      previewP.className = 'search-result-preview-text';
      previewP.setAttribute('aria-hidden', 'true');
      previewP.textContent = safeText(instructions);
      body.appendChild(previewP);
    }

    const footer = document.createElement('footer');
    footer.className = 'search-result-meta';
    const small = document.createElement('small');
    small.textContent = `${safeText(meal.strArea || '')}${meal.strCategory ? ' • ' + safeText(meal.strCategory) : ''}`;
    footer.appendChild(small);
    body.appendChild(footer);

    const img = document.createElement('img');
    img.className = 'search-list-img';
    img.src = `${meal.strMealThumb}/small`;
    img.alt = `Foto av rätten ${safeText(meal.strMeal)}`;

    article.appendChild(header);
    article.appendChild(body);
    article.appendChild(img);
    link.appendChild(article);
    li.appendChild(link);
    return li;
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
      if(resultsSection) resultsSection.setAttribute('aria-busy', 'true');
      grid.innerHTML = "<li>Laddar recept...</li>";
      const mealPromises = filterData.meals.slice(0, 12).map(meal => 
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
          .then(r => r.json())
          .then(data => data.meals?.[0])
          .catch(() => null) // Handle individual failures
      );
      
      const fullMeals = await Promise.all(mealPromises);
      
      // Step 3: Render cards with full data
      grid.innerHTML = ""; // clear loading
      const frag = document.createDocumentFragment();
      fullMeals.filter(Boolean).forEach(m => frag.appendChild(card(m)));
      grid.appendChild(frag);
      if(resultsSection) resultsSection.setAttribute('aria-busy', 'false');
    }catch(err){
      grid.innerHTML = "<p>Kunde inte hämta data just nu.</p>";
      console.error(err);
      if(resultsSection) resultsSection.setAttribute('aria-busy', 'false');
    }
  });
})();
