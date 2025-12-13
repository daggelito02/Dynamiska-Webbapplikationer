// recipe.js - builds recipe detail by id from TheMealDB
(async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const wrap = document.getElementById("recipe-article");

  if (!wrap) return;

  if (!id) {
    wrap.innerHTML = "<p>Saknar id för recept.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
        id
      )}`
    );
    const data = await res.json();

    if (!data.meals || data.meals.length === 0) {
      wrap.innerHTML = "<p>Hittade inte recept.</p>";
      return;
    }

    const m = data.meals[0];

    const titleEl = document.getElementById("recipe-title");

    if (titleEl) {
      titleEl.textContent = m.strMeal || "Okänt recept";
      titleEl.lang = "en";
    }

    // Sätt sidtitel dynamiskt (valfritt men trevligt)
    if (m.strMeal) {
      document.title = `${m.strMeal} – Ingrediensen ger receptet`;
    }

    // --- Bygg upp innehållet ---

    // Översikt: bild + meta
    const overview = document.createElement("div");
    overview.className = "recipe-overview";

    // Bild/picture
    const picture = document.createElement("picture");
    picture.className = "recipe-picture";

    const thumb = m.strMealThumb || "";
    const baseImg = thumb.replace(/\/(preview|medium|large)$/, "");
    const hasBase = !!baseImg;
    const largeSrc = hasBase ? `${baseImg}/large` : thumb;
    const mediumSrc = hasBase ? `${baseImg}/medium` : thumb;
    const defaultSrc = hasBase ? baseImg : thumb;

    if (largeSrc) {
      const sLarge = document.createElement("source");
      sLarge.srcset = largeSrc;
      sLarge.media = "(min-width:1024px)";
      picture.appendChild(sLarge);
    }

    if (defaultSrc) {
      const sDefault = document.createElement("source");
      sDefault.srcset = defaultSrc;
      sDefault.media = "(min-width:640px)";
      picture.appendChild(sDefault);
    }

    if (mediumSrc) {
      const sMedium = document.createElement("source");
      sMedium.srcset = mediumSrc;
      sMedium.media = "(min-width:350px)";
      picture.appendChild(sMedium);
    }

    const img = document.createElement("img");
    img.className = "recipe-img";
    img.src = largeSrc || mediumSrc || defaultSrc || "";
    img.alt = `Foto av rätten ${m.strMeal || ""}`;
    picture.appendChild(img);

    overview.appendChild(picture);

    // Meta-info (kategori + kök)
    const meta = document.createElement("div");
    meta.className = "recipe-meta";

    const catP = document.createElement("p");
    const catStrong = document.createElement("strong");
    catStrong.textContent = "Kategori:";
    catP.appendChild(catStrong);
    const catText = document.createElement("span");
    catText.textContent = " " + (m.strCategory || "-");
    catText.lang = "en";
    catP.appendChild(catText);

    const areaP = document.createElement("p");
    const areaStrong = document.createElement("strong");
    areaStrong.textContent = "Kök:";
    areaP.appendChild(areaStrong);
    const areaText = document.createElement("span");
    areaText.textContent = " " + (m.strArea || "-");
    areaText.lang = "en";
    areaP.appendChild(areaText);

    meta.appendChild(catP);
    meta.appendChild(areaP);

    overview.appendChild(meta);

    // --- Textinnehåll: ingredienser + instruktioner ---
    const textWrap = document.createElement("div");
    textWrap.className = "recipe-text-content";

    // Ingredienser
    const ingDiv = document.createElement("div");
    ingDiv.className = "recipe-ingredients";

    const ingH2 = document.createElement("h2");
    ingH2.textContent = "Ingredienser";
    ingDiv.appendChild(ingH2);

    const ingUl = document.createElement("ul");
    ingUl.className = "recipe-ingredients-list";

    let hasIngredients = false;

    for (let i = 1; i <= 20; i++) {
      const ing = m[`strIngredient${i}`];
      const meas = m[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = meas
          ? `${ing.trim()} – ${meas.trim()}`
          : ing.trim();
        li.lang = "en";
        ingUl.appendChild(li);
        hasIngredients = true;
      }
    }

    if (!hasIngredients) {
      const li = document.createElement("li");
      li.textContent = "Inga ingredienser tillgängliga.";
      ingUl.appendChild(li);
    }

    ingDiv.appendChild(ingUl);

    // Instruktioner
    const instrDiv = document.createElement("div");
    instrDiv.className = "recipe-instructions";

    const instrH2 = document.createElement("h2");
    instrH2.textContent = "Instruktioner";
    instrDiv.appendChild(instrH2);

    const instrOl = document.createElement("ol");
    instrOl.className = "recipe-instructions-list";

    const rawInstructions = m.strInstructions || "";
    const lines = rawInstructions
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter((line) => line && !/^▢+$/.test(line));

    if (lines.length > 0) {
      for (const line of lines) {
        const li = document.createElement("li");
        li.textContent = line;
        li.lang = "en";
        instrOl.appendChild(li);
      }
    } else {
      const li = document.createElement("li");
      li.textContent = "Inga instruktioner tillgängliga.";
      instrOl.appendChild(li);
    }

    instrDiv.appendChild(instrOl);

    // Länkar (YouTube + källa)
    const linksDiv = document.createElement("div");
    linksDiv.className = "recipe-links";

    if (m.strYoutube) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.className = "new-window";
      a.href = m.strYoutube;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Se video på YouTube";
      p.appendChild(a);
      linksDiv.appendChild(p);
    }

    if (m.strSource) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.className = "new-window";
      a.href = m.strSource;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Källa";
      p.appendChild(a);
      linksDiv.appendChild(p);
    }

    instrDiv.appendChild(linksDiv);

    // Lägg ihop allt
    textWrap.appendChild(ingDiv);
    textWrap.appendChild(instrDiv);

    // Append till wrap (behåller befintlig H1)
    wrap.appendChild(overview);
    wrap.appendChild(textWrap);
  } catch (err) {
    wrap.innerHTML = "<p>Kunde inte hämta receptet.</p>";
    console.error(err);
  }
})();
