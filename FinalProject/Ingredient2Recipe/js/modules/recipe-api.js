// recipe-api.js - API modul för att hämta receptdata från TheMealDB
export class RecipeAPI {
  constructor() {
    this.baseURL = 'https://www.themealdb.com/api/json/v1/1';
  }

  /**
   * Hämta recept filtrerade på ingrediens
   * @param {string} ingredient - Ingrediens att söka på
   * @returns {Promise<Array>} - Array med receptobjekt
   */
  async searchByIngredient(ingredient) {
    try {
      if (!ingredient || ingredient.trim().length === 0) {
        throw new Error('Ingrediens kan inte vara tom');
      }

      // Steg 1: Hämta filtrerad lista
      const filterResponse = await fetch(
        `${this.baseURL}/filter.php?i=${encodeURIComponent(ingredient.trim())}`
      );
      
      if (!filterResponse.ok) {
        throw new Error(`HTTP error! status: ${filterResponse.status}`);
      }
      
      const filterData = await filterResponse.json();

      if (!filterData.meals) {
        return [];
      }

      // Steg 2: Hämta fullständiga detaljer för första 12 recept
      const detailPromises = filterData.meals
        .slice(0, 12)
        .map(meal => this.getMealDetails(meal.idMeal));

      const meals = await Promise.all(detailPromises);
      return meals.filter(Boolean); // Ta bort null-värden
      
    } catch (error) {
      console.error('Error in searchByIngredient:', error);
      throw error;
    }
  }

  /**
   * Hämta fullständiga detaljer för ett recept
   * @param {string} mealId - ID för receptet
   * @returns {Promise<Object|null>} - Receptobjekt eller null
   */
  async getMealDetails(mealId) {
    try {
      const response = await fetch(
        `${this.baseURL}/lookup.php?i=${encodeURIComponent(mealId)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.meals?.[0] || null;
      
    } catch (error) {
      console.error(`Error fetching meal ${mealId}:`, error);
      return null;
    }
  }

  /**
   * Hämta slumpmässigt recept
   * @returns {Promise<Object|null>} - Receptobjekt eller null
   */
  async getRandomMeal() {
    try {
      const response = await fetch(`${this.baseURL}/random.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.meals?.[0] || null;
      
    } catch (error) {
      console.error('Error fetching random meal:', error);
      return null;
    }
  }

  /**
   * Hämta recept med specifik ingrediens (används för veckans tips)
   * @param {string} ingredient - Ingrediens att söka på
   * @returns {Promise<Object|null>} - Första receptet eller null
   */
  async getFirstByIngredient(ingredient) {
    try {
      const meals = await this.searchByIngredient(ingredient);
      return meals.length > 0 ? meals[0] : null;
    } catch (error) {
      console.error('Error in getFirstByIngredient:', error);
      return null;
    }
  }
}
