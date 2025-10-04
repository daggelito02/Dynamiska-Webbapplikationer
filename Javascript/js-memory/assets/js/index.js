import {shuffle} from './utils.js';
let cars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let clickable = true;
let gameArea;
let openCard;


addEventListener('load', main);

function main() {
    removeEventListener('load', main);
    gameArea = document.querySelector('#game-area');
    createGameAre();
    gameArea.addEventListener('click', cardClick);
}

function cardClick(event) {
    const TARGET = event.target;
    if(TARGET.tagName.toLowerCase() != 'img' || !clickable) return;
    console.dir(event);

    TARGET.classList.remove('hidden');

    if(openCard === undefined) {
        openCard = TARGET;
    } else if(openCard.src != TARGET.src) {
        clickable = false;
        setTimeout(function() {
            openCard.classList.add('hidden');
            TARGET.classList.add('hidden');
            openCard = undefined;
            clickable = true;
        }, 1000);
    } else {
        openCard = undefined;
    }

}



function createGameAre() {
    cars = cars.concat(cars);
    cars = shuffle(cars);

    for (let index = 0; index < cars.length; index++) {
        const CAR_NUMBER = cars[index];

        let div = document.createElement('div');
            div.classList.add('card');
        let img = document.createElement('img');
            img.classList.add('hidden');
            img.setAttribute('src', `assets/img/car-${CAR_NUMBER}.jpg`);

        div.appendChild(img);
        gameArea.appendChild(div);
    }
}


/*
<div class="card">
    <img src="assets/img/car-1.jpg" class="hidden">
</div>
*/