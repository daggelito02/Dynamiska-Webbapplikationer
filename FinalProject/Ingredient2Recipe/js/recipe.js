
// recipe.js - builds recipe detail by id from TheMealDB
(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const wrap = document.getElementById('recipe-article');
  if(!id){ wrap.innerHTML = "<p>Saknar id för recept.</p>"; return; }

  function listIngredients(meal){
    const items = [];
    for(let i=1;i<=20;i++){
      const ing = meal[`strIngredient${i}`];
      const meas = meal[`strMeasure${i}`];
      if(ing && ing.trim() !== ""){
        items.push(`<li>${ing}${meas ? ` – ${meas}`: ""}</li>`);
      }
    }
    return items.join("");
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`)
    .then(r=>r.json())
    .then(({meals})=>{
      if(!meals){ wrap.innerHTML = "<p>Hittade inte recept.</p>"; return; }
      const m = meals[0];
      wrap.innerHTML = `
        <h1 class="recipe-header">${m.strMeal}</h1>
        <div class="recipe-overview">
          <img src="${m.strMealThumb}" alt="Foto av rätten ${m.strMeal}">
          <div class="recipe-meta">
            <p><strong>Kategori:</strong> ${m.strCategory || "-"}</p>
            <p><strong>Kök:</strong> ${m.strArea || "-"}</p>
          </div>
        </div>
        <div class="recipe-ingredients">
          <h2>Ingredienser</h2>
          <ul>${listIngredients(m)}</ul>
        </div>
        <div class="recipe-instructions">
          <h2>Instruktioner</h2>
          <p>${(m.strInstructions || "").split("\r\n").map(line=>line.trim()).filter(Boolean).join("</p><p>")}</p>
          ${m.strYoutube ? `<p><a class="new-window" href="${m.strYoutube}" target="_blank" rel="noopener">Se video på YouTube</a></p>` : ""}
          <p><a class="new-window" href="${m.strSource || '#'}" target="_blank" rel="noopener">Källa</a></p>
        </div>
        
      `;
    })
    .catch(err=>{
      wrap.innerHTML = "<p>Kunde inte hämta receptet.</p>";
      console.error(err);
    });
})();
