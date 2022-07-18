const EventNames = {
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    CLICK: "click",
    MOUSE_OVER: "mouseover",
    MOUSE_OUT: "mouseout"
    // etc
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isDebug = urlParams.get('debug');

const Letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const States = {
    good: "&#x2705;",
    wrong: "&#x274C;"
};

let debug = (window.location.protocol == "file:") || (window.location.hostname == "127.0.0.1") || (isDebug == "true");
if (isDebug == "false") {
    debug = false;
}
console.log("debug", debug);

class AbstractButton extends EventTarget{
    constructor(buttonDiv){
        super();

        this.buttonDiv = buttonDiv;
        // https://medium.com/@bigcatplichta/javascript-use-bind-to-dynamically-add-and-remove-event-listeners-d6b443877a73
        this.boundEventHandler = this.buttonClickHandler.bind(this);
        this.isDisable = false;
        console.log("buttonDiv", this.buttonDiv);
    }

    /**
     * @description Disable or not the button.
     * @param {Boolean} bool 
     */
    disable(bool = true) {
        this.isDisable = bool;
        this.buttonDiv.style.cursor = bool ? "auto" : "pointer";
        if (bool) {
            this.buttonDiv.removeEventListener(EventNames.CLICK, this.boundEventHandler);
        } else {
            this.buttonDiv.addEventListener(EventNames.CLICK, this.boundEventHandler)
        }
    }

    buttonClickHandler(){
        console.log("AbstractButton clicked.", this);
    }
    
};
class AbstractGame {
    constructor() {
        console.log("Démarrage du jeu.");
    }

    init(dataSource) {
        console.log("Initialisation du jeu");
    }
}

class Line{
    constructor(dataSource){
        this.dataSource = dataSource;
    }
}

const CardEventsName = {
    CARD_CLICK: "card_click"
    // etc
};

class CardEvent extends CustomEvent{
    constructor(type){
        super(type);
    }
}

class Card extends AbstractButton {
    constructor(buttonDiv) {
        super(buttonDiv);
    }

    get letter() {
        return this.buttonDiv.getAttribute("data-attr");
    }

    set letter(value) {
        this.face.textContent = value;
    }

    get face() {
        return this.buttonDiv.querySelector(".face");
    }

    get back() {
        return this.buttonDiv.querySelector(".arriere");
    }
    
    get doubleFace(){
        return this.buttonDiv.querySelector(".double-face");
    }

    activate(flag) {
        if (flag) {
            this.doubleFace.classList.toggle("active");
        }else{
            this.doubleFace.classList.remove("active");
        }
    }

    rotate(){

    }

    buttonClickHandler(evt){
        super.buttonClickHandler(evt);
        this.dispatchEvent(new CardEvent(CardEventsName.CARD_CLICK));
    }
}

class PairGame extends AbstractGame {
    constructor() {
        super();

        this.firstCard;
        this.secondCard;
        this.line = [];
        this.cards = [];
        this.allCouples = [];
    }

    initLines(dataSource){
        for (const lineDiv of dataSource.querySelectorAll(".ligne")) {
            const line = new Line(lineDiv);
            this.line.push(line);
        }
    };

    initCards(dataSource){
        dataSource.querySelectorAll(".carte").forEach(cardDiv => {
            const card = new Card(cardDiv);
            card.addEventListener(CardEventsName.CARD_CLICK, function () {
                this.cardClickHandler(card);
            }.bind(this));
            card.disable(false);
            card.letter = card.letter;
            this.cards.push(card);
        });
    }

    isCardsMatch() {
        return this.firstCard.letter == this.secondCard.letter;
    }

    
    /**
     * @description La méthode init charge les données dans la l'élément html contenu dans dataSource. Elle appelle les méthodes d'initialisation
     * @param {*} dataSource 
     */
    init(dataSource) {
        this.initCards(dataSource);
        this.initLines(dataSource);
        Letters.forEach(letter => {
            let couples = [];
            if (this.cards.find(e => e == letter)) {
                couples.push(letter);
            }
            this.allCouples.push(couples);
        });
    }

    /**
     * @description Check the cards when 2 cards are clicked.
     */
    checkCouple() {
        this.locked = true;
        if (this.isCardsMatch()) {
            // .splice(.indexOf());
        } else {
            this.firstCard.activate(false);
            this.secondCard.activate(false);
            this.firstCard.disable(false);
            this.secondCard.disable(false);
            this.firstCard = null;
            this.secondCard = null;
            this.locked = false;
        }

    }

    cardClickHandler(card) {
        console.log("cardClickHandler", card);
        
        if (this.locked) {
            return;
        }
        card.activate(true);
        if(!this.firstCard){
            this.firstCard = card;
            this.firstCard.disable(true);
        }else{
            this.secondCard = card;
            this.secondCard.disable(true);
        }
        if(this.firstCard && this.secondCard){
            this.checkCouple();
        }
    }

    flipCards(){

    }
}

// var cardDiv = document.querySelectorAll(".carte")[1];
// console.log(cardDiv);
// const card = new Card(cardDiv);

// card.activate(true);

const pairGame = new PairGame();
pairGame.init(document);
