class CalcController {
    // Executed when the object is instantiated
    constructor() {
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._locale = 'pt-BR';
        // Creating methods
        this.initialize();
        this.setDisplayDateTime();
        this.initButtonsEvents();
    }

    // Set the current date into screen
    initialize() {
        /** 
        * Calling for the first time out of the setInterval 
        * cause you don't need wait 1 sec to show the current date and time
        */
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    /**
     * You'll call more than one time into initialize this block of code
     * So, use the encapsulation and reuse this block of code, creating a func
     */

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    };

    /**
     * Here I created my own Event Listener, that recieve some args.
     * @param element: the element that will be added an event
     * @param {*} events : what kinda of events I want
     * @param {*} fn : the function to that element
     */
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach( event  => {
            element.addEventListener(event, fn, false);
        });
    };

    initButtonsEvents() {
        // Getting all buttons and parts
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        
        // Looping through the buttons
        buttons.forEach((btn, index) => {
            /**
             * Handling the click and drag events
             */
            this.addEventListenerAll(btn, 'click drag', e=> {
                console.log(btn.className.baseVal.replace("btn-", ""));
            });

            /**
             * Handling the mouserover mouseup and mousedown events
             * Just change the cursor to pointer
             */
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=> {
                btn.style.cursor = "pointer";
            });

        });
    };

    /**
     * Getters and setters
     */
    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(arg) {
        return this._timeEl.innerHTML = arg;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }
    
    set displayDate(arg) {
        return this._dateEl.innerHTML = arg;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(arg) {
        this._displayCalcEl.innerHTML = arg;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(arg) {
        this._currentDate = arg;
    }
}