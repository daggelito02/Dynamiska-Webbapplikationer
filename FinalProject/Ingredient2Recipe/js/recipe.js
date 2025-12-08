
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
      const baseImg = (m.strMealThumb || '').replace(/\/(preview|medium|large)$/,'');
      const mediumSrc = baseImg ? `${baseImg}/medium` : m.strMealThumb;
      const largeSrc = baseImg ? `${baseImg}/large` : m.strMealThumb;
      // For this page: >=1024px large, >=640px large, >=350px medium, fallback img uses large
      wrap.innerHTML = `
        <h1 id="recipe-title" class="recipe-header">${m.strMeal}</h1>
        <div class="recipe-overview">
          <picture class="recipe-picture">
            <source srcset="${largeSrc}" media="(min-width:1024px)">
            <source srcset="${baseImg}" media="(min-width:640px)">
            <source srcset="${mediumSrc}" media="(min-width:350px)">
            <img class="recipe-img" src="${largeSrc}" alt="Foto av rätten ${m.strMeal}">
          </picture>
          <div class="recipe-meta">
            <p><strong>Kategori:</strong> ${m.strCategory || "-"}</p>
            <p><strong>Kök:</strong> ${m.strArea || "-"}</p>
          </div>
        </div>
        <div class="recipe-text-content">
           <div class="recipe-ingredients">
            <h2>Ingredienser</h2>
            <ul class="recipe-ingredients-list">${listIngredients(m)}</ul>
          </div>
          <div class="recipe-instructions">
            <h2>Instruktioner</h2>
            <p class="recipe-instruction-text">
                  ${(m.strInstructions || "")
                 .split("\r\n")
                 .map(line => line.trim())
                 .filter(line => line && !/^▢+$/.test(line))
                 .join("</p><p class=\"recipe-instruction-text\">")}
            </p>
            <div class="recipe-links">
              ${m.strYoutube ? `<p><a class="new-window" href="${m.strYoutube}" target="_blank" rel="noopener noreferrer">Se video på YouTube</a></p>` : ""}
              <p><a class="new-window" href="${m.strSource || '#'}" target="_blank" rel="noopener noreferrer">Källa</a></p>
            </div>
          </div>
        </div>
      `;
    })
    .catch(err=>{
      wrap.innerHTML = "<p>Kunde inte hämta receptet.</p>";
      console.error(err);
    });
})();
