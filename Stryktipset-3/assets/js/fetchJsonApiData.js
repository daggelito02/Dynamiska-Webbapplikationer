// Hämtar Stryktipset-data från API:t
async function fetchJsonApiData() {
  try {
    const res = await fetch("https://api-internal.azurewebsites.net/strycket2025");
    const data = await res.json();

    if (!data.success) {
      throw new Error("API returned success=false");
    }

    return data.playedGames; // Returnerar arrayen med matcher
  } catch (err) {
    console.error("Error fetching stryktipset:", err);
    return []; // Returnerar tom array vid fel
  }
}

export default fetchJsonApiData;

