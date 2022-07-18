const EventNames = {
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    CLICK: "click",
    MOUSE_OVER: "mouseover",
    MOUSE_OUT: "mouseout"
    // etc
};
// -------------- MODE DEBUG --------------------
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isDebug = urlParams.get('debug');
let debug = (window.location.protocol == "file:") || (window.location.hostname == "127.0.0.1") || (isDebug == "true");
if (isDebug == "false") {
    debug = false;
}
console.log("debug", debug);
// -------------- MODE DEBUG --------------------

const Letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const states = {
    good: "&#x2705;",
    wrong: "&#x274C;"
};

const Delays = {
    FLIP: 1500
};

class AbstractButton extends EventTarget {
    constructor(buttonDiv) {
        super();

        this.buttonDiv = buttonDiv;
        // https://medium.com/@bigcatplichta/javascript-use-bind-to-dynamically-add-and-remove-event-listeners-d6b443877a73
        this.boundEventHandler = this.buttonClickHandler.bind(this);
        this.isDisable = false;
        // console.log("buttonDiv", this.buttonDiv);
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

    buttonClickHandler() {
        console.log("AbstractButton clicked.", this);
    }

};

const AbstractGameEventNames = {
    INIT: "init",
    WIN: "win",
    LOSE: "lose"
};

class AbstractGameEvent extends CustomEvent {
    constructor(type) {
        super(type);
    }
};

class AbstractGame extends EventTarget {
    constructor() {
        super();
        console.log("Démarrage du jeu.");
    }

    init(dataSource) {
        console.log("Initialisation du jeu");
    }
}

class Line {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
}

const CardEventNames = {
    CARD_CLICK: "card_click"
    // etc
};

class CardEvent extends CustomEvent {
    constructor(type) {
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

    get doubleFace() {
        return this.buttonDiv.querySelector(".double-face");
    }

    activate(flag) {
        if (flag) {
            this.doubleFace.classList.toggle("active");
        } else {
            this.doubleFace.classList.remove("active");
        }
    }

    rotate() {
        this.face.style.transform = "rotateY(180deg)";
    }

    buttonClickHandler(evt) {
        super.buttonClickHandler(evt);
        this.dispatchEvent(new CardEvent(CardEventNames.CARD_CLICK));
    }
}

const PairGameEventNames = {
    GOOD: "good",
    WRONG: "wrong",
    FLIP: "flip"
};

class PairGameEvent extends AbstractGameEvent{
    constructor(type){
        super(type);
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

    get remainingCouples(){
        return this.allCouples.length;
    }

    initLines(dataSource) {
        for (const lineDiv of dataSource.querySelectorAll(".ligne")) {
            const line = new Line(lineDiv);
            this.line.push(line);
        }
    };

    initCards(dataSource) {
        dataSource.querySelectorAll(".carte").forEach(cardDiv => {
            const card = new Card(cardDiv);
            card.addEventListener(CardEventNames.CARD_CLICK, function () {
                this.cardClickHandler(card);
            }.bind(this));
            card.disable(false);
            card.letter = card.letter;

            if(debug){
                card.back.textContent = card.letter;
                console.log("tetet", card.back.textContent);
            }

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
        // console.warn("TOTO",dataSource);
        this.initCards(dataSource);
        this.initLines(dataSource);
        console.log("ALEX", this.cards);
        
        Letters.forEach(letter => {
            let couples = [];
            
            // if (this.cards.find(e => e == letter)) {
            //     console.log("toto", e);
                
            //     couples.push(e);
            // }

            for (const card of this.cards) {
                if(card.letter == letter){
                    card.rotate();
                    couples.push(card);
                }
            }
            


            this.allCouples.push(couples);
        });

        this.flipCards();
    }

    /**
     * @description Check the cards when 2 cards are clicked.
     */
    checkCouple() {
        this.locked = true;
        if (this.isCardsMatch()) {
            console.log(this.allCouples);
            for (const couple of this.allCouples) {
                const first = couple[0];
                console.log("Log first",first);

                if (first.letter == this.firstCard.letter) {
                    this.allCouples.splice(this.allCouples.indexOf(couple), 1);
                    console.log("Longeur du tableau allCouples", this.allCouples.length);
                }
                break;
            }
            if (this.allCouples.length == 0) {
                console.log("Partie terminée");
            }
            this.firstCard = null;
            this.secondCard = null;
            this.locked = false;

            this.dispatchEvent(new PairGameEvent(PairGameEventNames.GOOD));
        } else {
            console.log("WRONG");
            
            this.dispatchEvent(new PairGameEvent(PairGameEventNames.WRONG));
            setTimeout(() => {
                this.firstCard.activate(false);
                this.secondCard.activate(false);
                this.firstCard.disable(false);
                this.secondCard.disable(false);
                this.firstCard = null;
                this.secondCard = null;
                this.locked = false;
            }, Delays.FLIP);
        }

    }

    cardClickHandler(card) {
        // console.log("cardClickHandler", card);

        if (this.locked) {
            return;
        }
        card.activate(true);
        if (!this.firstCard) {
            this.firstCard = card;
            this.firstCard.disable(true);
        } else {
            this.secondCard = card;
            this.secondCard.disable(true);
        }
        if (this.firstCard && this.secondCard) {
            this.checkCouple();
        }
    }

    flipCards() {
        for (const card of this.cards) {
            card.activate(true);
            setTimeout(() => {
                card.activate(false);
                card.disable(false);
            }, Delays.FLIP);
        };
    }
}

// var cardDiv = document.querySelectorAll(".carte")[1];
// console.log(cardDiv);
// const card = new Card(cardDiv);

// card.activate(true);

function pairGameGoodWrongHandler(evt){
    console.log("pairGameGoodWrongHandler", evt);
    const stateDiv = document.querySelector("#state");
    stateDiv.innerHTML = evt.type == PairGameEventNames.GOOD ? states.good : states.wrong;
    if(evt.type == PairGameEventNames.GOOD){

    }
}

const pairGame = new PairGame();
pairGame.addEventListener(PairGameEventNames.GOOD, pairGameGoodWrongHandler);
pairGame.addEventListener(PairGameEventNames.WRONG, pairGameGoodWrongHandler);
pairGame.init(document);
