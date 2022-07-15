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

class AbstractButton {
    constructor(buttonDiv) {
        this.buttonDiv = buttonDiv;
    }

    disable(bool = true) {
        this.buttonDiv.disabled = bool;
        this.buttonDiv.className = bool ? "disabled" : "buttonNextPrevious";
        if (bool) {
            this.buttonDiv.removeEventListener(EventNames.CLICK, buttonClickHandler);
        } else {
            this.buttonDiv.addEventListener(EventNames.CLICK, buttonClickHandler);
        }
    }

    buttonClickHandler() {
        console.log(this.buttonDiv);
    }
}
class AbstractGame {
    constructor() {
        console.log("Démarrage du jeu.");
    }

    init(dataSource) {
        console.log("Initialisation du jeu");
    }
}

class Card extends AbstractButton {
    constructor(buttonDiv) {
        super(buttonDiv);
    }

    get letter() {
        return buttonDiv.getAttribute("data-attr");
    }

    get face() {
        return buttonDiv.querySelector("face");
    }

    get back() {
        return buttonDiv.querySelector("arriere");
    }

    get doubleFace(){
        return buttonDiv.querySelector("double-face");
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
}

class PairGame extends AbstractGame {
    constructor() {
        super();

        this.firstCard = firstCard;
        this.secondCard = secondCard;
    }

    initLines(dataSource){
           querySelector("ligne");
    };

    isCardsMatch() {
        return this.firstCard == this.secondCard;
    }      
    
    // La méthode init charge les données dans la l'élément html contenu dans dataSource
    // elle appelle les méthodes d'initialisation
    // elle vérifie


    initLines(dataSource) {

    };

    isCardsMatch() {
        return this.firstCard == this.secondCard;
    }
 
    /**
     * @description La méthode init charge les données dans la l'élément html contenu dans dataSource. Elle appelle les méthodes d'initialisation.
     * @param {*} dataSource 
     */
    init(dataSource) {
        initLines(dataSource);
        initCards(dataSource);
        Letters.forEach(letter => {
            couples = [];
            if (cards.find(e => e == letter)) {
                couples.push(card);
            }
        });
        allCouples.push(couple);
    }

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
        
    }

    flipCards(){

}
}

var cardDiv = document.querySelectorAll(".carte")[1];
console.log(cardDiv);
const card = new Card(cardDiv);

card.activate(true);

const pairGame = new PairGame();
// pairGame.init();
