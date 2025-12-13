// search.js - builds search page results from TheMealDB by ingredient using filter.php?i=
(function () {
  const form =
    document.getElementById("ingredient-form") ||
    document.querySelector('form[role="search"]');
  const input = document.getElementById("q");
  const list = document.getElementById("search-list");
  const resultsSection = document.getElementById("results");

  // Toggle for search-info aside
  const toggleBtn = document.getElementById("search-info-toggle");
  const aside = document.getElementById("search-info");

  if (toggleBtn && aside) {
    const downArrow = toggleBtn.querySelector(".search-arrow-down");
    const upArrow = toggleBtn.querySelector(".search-arrow-up");

    const setClosedVisual = () => {
      if (downArrow) downArrow.style.display = "inline";
      if (upArrow) upArrow.style.display = "none";
    };
    const setOpenVisual = () => {
      if (downArrow) downArrow.style.display = "none";
      if (upArrow) upArrow.style.display = "inline";
    };

    toggleBtn.addEventListener("click", () => {
      const isOpen = aside.classList.contains("open");
      aside.classList.toggle("open");
      const nowOpen = !isOpen;
      toggleBtn.setAttribute("aria-expanded", String(nowOpen));
      if (nowOpen) setOpenVisual();
      else setClosedVisual();
    });

    aside.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        aside.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
        setClosedVisual();
        toggleBtn.focus();
      }
    });
  }

  // Om något saknas, avbryt lugnt
  if (!form || !input || !list) {
    return;
  }

  function card(meal) {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = `recipe.html?id=${meal.idMeal}`;
    link.className = "search-result-link";

    const article = document.createElement("article");
    article.className = "search-result-article";

    const header = document.createElement("header");
    header.className = "search-result-header";
    const h3 = document.createElement("h3");
    h3.textContent = meal.strMeal || "Okänt recept";
    header.appendChild(h3);

    const body = document.createElement("div");
    body.className = "search-result-text-content";

    const instructions = meal.strInstructions || "";
    if (instructions) {
      const previewP = document.createElement("p");
      previewP.className = "search-result-preview-text";
      previewP.setAttribute("aria-hidden", "true");
      previewP.textContent = instructions;
      body.appendChild(previewP);
    }

    const footer = document.createElement("footer");
    footer.className = "search-result-meta";
    const small = document.createElement("small");
    const area = meal.strArea || "";
    const category = meal.strCategory || "";
    small.textContent = area
      ? category
        ? `${area} • ${category}`
        : area
      : category;
    footer.appendChild(small);
    body.appendChild(footer);

    const img = document.createElement("img");
    img.className = "search-list-img";
    const thumb = meal.strMealThumb || "";
    img.src = thumb ? `${thumb}/small` : "";
    img.alt = `Foto av rätten ${meal.strMeal || ""}`;
    img.loading = "lazy";
    img.decoding = "async";

    article.appendChild(header);
    article.appendChild(body);
    article.appendChild(img);
    link.appendChild(article);
    li.appendChild(link);
    return li;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    list.innerHTML = "";
    const q = input.value.trim();
    if (q.length === 0) {
      list.innerHTML = "<li>Ange något att söka på.</li>";
      input.focus();
      return;
    }
    try {
      // Step 1: Get filtered list by ingredient
      if (resultsSection)
        resultsSection.setAttribute("aria-busy", "true");

      const filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        q
      )}`;
      const filterRes = await fetch(filterUrl);
      const filterData = await filterRes.json();

      if (!filterData.meals) {
        list.innerHTML =
          "<li>Inga träffar. Testa ett annat sökord.</li>";
        if (resultsSection)
          resultsSection.setAttribute("aria-busy", "false");
        return;
      }

      // Step 2: Fetch full details for each meal (limited to 12 for performance)
      list.innerHTML = "<li>Laddar recept...</li>";
      const mealPromises = filterData.meals
        .slice(0, 12)
        .map((meal) =>
          fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          )
            .then((r) => r.json())
            .then((data) => data.meals?.[0])
            .catch(() => null)
        );

      const fullMeals = await Promise.all(mealPromises);

      // Step 3: Render cards with full data
      list.innerHTML = ""; // clear loading
      const frag = document.createDocumentFragment();
      fullMeals.filter(Boolean).forEach((m) => frag.appendChild(card(m)));
      list.appendChild(frag);

      if (resultsSection)
        resultsSection.setAttribute("aria-busy", "false");
    } catch (err) {
      list.innerHTML =
        "<li>Kunde inte hämta data just nu.</li>";
      console.error(err);
      if (resultsSection)
        resultsSection.setAttribute("aria-busy", "false");
    }
  });
})();
