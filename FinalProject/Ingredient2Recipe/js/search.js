
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
    a.className = 'card col-span-12 col-span-6-md col-span-3-lg';
    a.setAttribute('aria-label', `Visa recept: ${meal.strMeal}`);
    a.innerHTML = `
      <img src="${meal.strMealThumb}" alt="Foto av rätten ${safeText(meal.strMeal)}">
      <h3>${safeText(meal.strMeal)}</h3>
      <p><small>${safeText(meal.strArea || "")} ${meal.strCategory ? "• " + safeText(meal.strCategory) : ""}</small></p>
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
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();
      if(!data.meals){
        grid.innerHTML = "<p>Inga träffar. Testa ett annat sökord.</p>";
        return;
      }
      const frag = document.createDocumentFragment();
      data.meals.slice(0, 24).forEach(m => frag.appendChild(card(m)));
      grid.appendChild(frag);
    }catch(err){
      grid.innerHTML = "<p>Kunde inte hämta data just nu.</p>";
      console.error(err);
    }
  });
})();
