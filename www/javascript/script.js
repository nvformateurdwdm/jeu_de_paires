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
        buttonDiv.disabled = bool;
        buttonDiv.className = bool ? "disabled" : "buttonNextPrevious";
        if (bool) {
            buttonDiv.removeEventListener(EventNames.CLICK, buttonClickHandler);
        } else {
            buttonDiv.addEventListener(EventNames.CLICK, buttonClickHandler);
        }
    }

    buttonClickHandler() {
        console.log(this.buttonDiv);
    }
}
class AbstractGame {
    constructor(){
        console.log("Démarrage du jeu.");
    }
    init(dataSource){
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
}