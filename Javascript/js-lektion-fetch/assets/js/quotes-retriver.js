// quotes-retriver.js

export async function getRandomQuote() {
    try {
        const response = await fetch('https://api-internal.azurewebsites.net/qod');

        if (!response.ok) {
            throw new Error('Något gick fel vid hämtning av citat');
        }

        const data = await response.json();
        console.log('API-svar:', data); // kolla hela svaret i konsolen

        // 👉 Hämta ut citatet från rätt plats i objektet
        if (data && data.contents && data.contents.quotes && data.contents.quotes.length > 0) {
            const quoteObj = data.contents.quotes[0];
            return {
                quote: quoteObj.quote,
                author: quoteObj.author
            };
        } else {
            console.warn('Oväntat format på data:', data);
            return null;
        }

    } catch (error) {
        console.error('Fel vid hämtning:', error);
        return null;
    }
}
