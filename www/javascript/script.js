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