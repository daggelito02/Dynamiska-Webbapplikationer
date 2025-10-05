const MSG = document.querySelector('.msg');
const RANDOM_MSG = [
    'hej',
    'då',
    'apan satt i en gren',
    'båt på land',
    'rymd i trångt utrymme',
    'något rött med inslag av annan färg',
    'osv'
];
MSG.addEventListener('click', (event) => {
    MSG.innerHTML = RANDOM_MSG[Math.floor(Math.random() * RANDOM_MSG.length)];
});