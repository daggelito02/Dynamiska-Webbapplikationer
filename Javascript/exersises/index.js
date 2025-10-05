const FORM = document.querySelector('form');
const INPUT = document.querySelector('input');
const RESULTS = document.querySelector('.results');

FORM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = INPUT.value.trim();
  if (!query) return;

  RESULTS.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await res.json();

    RESULTS.innerHTML = '';
    data.forEach(item => {
      const show = item.show;
      const div = document.createElement('div');
      div.classList.add('show');
      div.innerHTML = `
        <h2>${show.name}</h2>
        <img src="${show.image?.medium || 'no-image.png'}" alt="${show.name}">
        <p>${show.summary || 'No description available.'}</p>
      `;
      RESULTS.appendChild(div);
    });
  } catch (err) {
    RESULTS.innerHTML = '<p>Something went wrong!</p>';
    console.error(err);
  }
});

