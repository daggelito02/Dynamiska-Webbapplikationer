# Recipe Search Widget - Dokumentation

## Översikt
En widget för att söka recept baserat på ingredienser. Hämtar data från TheMealDB API och presenterar resultaten dynamiskt.

## Projektstruktur

### Index-filer (entry points för varje HTML-sida):
- **index.js** - Entry point för index.html (startsida med weekly tips)
- **html/index.js** - Entry point för search.html (sökwidget)
- **html/recipe-index.js** - Entry point för recipe.html (receptdetaljer)
- **html/inspiration-index.js** - Entry point för inspiration.html (nav-toggle)
- **html/about-index.js** - Entry point för about.html (nav-toggle)

### Widget-moduler (återanvändbara):
- **js/widget-api.js** - API-modul för att kommunicera med TheMealDB
- **js/widget-ui.js** - UI-modul för att skapa och hantera DOM-element

### Stödfiler:
- css/styles.css - Styling
- html/search.html - Widgetsida med endast `<div id="search-widget"></div>`

### Arkitekturmönster:
Varje HTML-sida har **exakt en** index.js-fil som:
- Importerar nödvändiga moduler (widget-api.js, widget-ui.js)
- Innehåller nav-toggle funktionalitet inline (ingen separat fil)
- Innehåller all sidspecifik logik
- Initialiseras vid DOMContentLoaded

## Kravuppfyllelse

### G-krav:
✅ **Data hämtas dynamiskt från externt API** - TheMealDB API vid varje sökning
✅ **Minst två JS-moduler** - Tre moduler: search-widget.js, widget-api.js, widget-ui.js
✅ **Konsekvent och syntaktiskt korrekt kod** - ES6 modules, klasser, async/await
✅ **Endast nativ JS** - Inga externa bibliotek

### VG-krav:
✅ **Widget passande till innehåll** - Receptsökning på mat-sajt
✅ **Mer än minimalt exempel** - Visar 12 recept med titel, bild, kategori, kök, och fullständiga instruktioner
✅ **Sökfunktion** - Text-input för att söka på ingredienser, upprepad sökning möjlig
✅ **Endast ett HTML-element** - `<div id="search-widget">` i HTML, allt annat skapas via JS
✅ **Objektorientering** - Tre klasser med tydlig ansvarsfördelning:
  - `RecipeSearchWidget` - Koordinerar och hanterar logik
  - `RecipeAPI` - Hanterar all API-kommunikation
  - `RecipeWidgetUI` - Skapar och manipulerar DOM-element

✅ **Kodstruktur och tydlighet**:
  - Modulär uppdelning (API, UI, Controller)
  - JSDoc-kommentarer på alla metoder
  - Beskrivande funktions- och variabelnamn
  - Konsekvent felhantering med try/catch

✅ **Övergripande kvalitet**:
  - Ingen kod-duplicering (återanvändning av metoder)
  - Minimala DOM-sökningar (sparar referenser)
  - Ingen död kod
  - Separation of concerns (API, UI, Logic)

## Arkitektur

### Modulmönster:
```
index.js (Entry Point)
    ├── initNavToggle() - Inline navigation toggle
    ├── RecipeSearchWidget (Controller)
    │   ├── widget-api.js (Data Layer)
    │   └── widget-ui.js (View Layer)
    └── DOMContentLoaded initialization
```

### RecipeSearchWidget (Controller) - i html/index.js
- Koordinerar API och UI
- Hanterar användarinteraktion
- Innehåller affärslogik

### RecipeAPI (Data Layer) - js/widget-api.js
- Kommunicerar med TheMealDB API
- Hanterar fetch-anrop och felhantering
- Returnerar strukturerad data
- **4 metoder**: searchByIngredient(), getMealDetails(), getRandomMeal(), getFirstByIngredient()

### RecipeWidgetUI (View Layer) - js/widget-ui.js
- Skapar alla DOM-element
- Manipulerar UI-tillstånd (loading, error, results)
- Hanterar visuell feedback
- **9 metoder**: createSearchForm(), createInfoAside(), createResultsSection(), createRecipeCard(), showLoading(), hideLoading(), showError(), showResults(), setupInfoToggle()

## Användning

### För utvecklare:
```html
<!-- I HTML-filen (search.html) -->
<div id="search-widget"></div>
<script src="index.js" type="module"></script>
```

### I index.js:
```javascript
import { RecipeAPI } from './widget-api.js';
import { RecipeWidgetUI } from './widget-ui.js';

function initNavToggle() { /* ... */ }
class RecipeSearchWidget { /* ... */ }

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  new RecipeSearchWidget('search-widget');
});
```

### För användare:
1. Skriv en ingrediens (på engelska) i sökfältet
2. Klicka "Sök recept"
3. Få upp till 12 recept som innehåller ingrediensen
4. Klicka på ett recept för att se fullständig information

## API-integration

### Endpoints som används:
- `filter.php?i={ingredient}` - Söker recept efter ingrediens
- `lookup.php?i={mealId}` - Hämtar fullständiga detaljer
- `random.php` - Hämtar slumpmässigt recept (för annan feature)

### Felhantering:
- Validering av användarinput
- Network error handling
- Tomma resultat hanteras gracefully
- Användarvänliga felmeddelanden

## Tillgänglighet

- ARIA-attribut (aria-live, aria-busy, aria-labelledby)
- Keyboard navigation support
- Semantisk HTML
- Lang-attribut på engelsk text
- Loading states för skärmläsare

## Viktiga överväganden vid data från tredje part

### Säkerhet:
- Alla API-anrop använder HTTPS
- Input saneras med encodeURIComponent()
- Inget direkt innerHTML med user input

### Prestanda:
- Begränsar till 12 recept för snabbare laddning
- Lazy loading av bilder
- Promise.all() för parallella anrop
- Async/await för bättre läsbarhet

### Robusthet:
- Fallback-värden när data saknas
- Null-checks på API-svar
- Try/catch på alla async operationer
- Timeout-hantering implicit via fetch

### UX vid API-problem:
- Loading-state under hämtning
- Tydliga felmeddelanden
- Möjlighet att söka igen
- Ingen krasch vid API-fel

## Testning

### Testa widgeten:
1. Öppna `html/search-widget.html`
2. Sök på "chicken" - ska ge många resultat
3. Sök på "xyz123" - ska visa "Inga träffar"
4. Sök med tomt fält - ska visa valideringsmeddelande
5. Testa responsiv design (mobil/desktop)

### Browser-kompatibilitet:
- Chrome/Edge (ES6 modules native)
- Firefox (ES6 modules native)
- Safari (ES6 modules native)

## Framtida förbättringar

- Caching av API-svar
- Paginering av resultat
- Filtrering på kategori/kök
- Favorit-funktion (localStorage)
- Offline-support (Service Worker)
