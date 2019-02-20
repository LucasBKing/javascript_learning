class CalcController {
    // Executed when the object is instantiated
    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this._locale = 'pt-BR';
        // Creating methods
        this.initialize();
        this.setDisplayDateTime();
        this.initButtonsEvents();
        this.initKeyboard();
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
        this.setLastNumberToDisplay();
        this.pasteToClipboard();

        document.querySelectorAll('.btn-ac').forEach( btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }

    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio() {
        if(this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
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

    setLastOperation(value) {
        this._operation[this._operation.length -1] = value;
    };

    getLastOperation() {
        return this._operation[this._operation.length -1];
    };

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    };

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    };

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    };

    pushOperation(value) {
        this._operation.push(value);

        if(this._operation.length > 3) {
            this.calc();
        }
    }
    
    getResult() {
        return eval(this._operation.join(""));
    }

    getLastItem(isOperator = true) {
        let lastItem;

        for(let i = this._operation.length - 1; i >= 0; i--) {
            //number
            if(this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    calc() {
        let last = '';

        this._lastOperator = this.getLastItem(); 

        if(this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if(this._operation.length == 3) {
            
            this._lastNumber = this.getLastItem(false);    
        }
        
        let result = this.getResult();

        if( last == '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];

            if (last) this._operation.push(last);
        }        

        this.setLastNumberToDisplay();

    }
    
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    };

    addOperatorion(value) {
        if(isNaN(this.getLastOperation())) {
            //String
            if(this.isOperator(value)) {
                // change operator
                this.setLastOperation(value);
            } else  if(isNaN(value)){
                // other thing
                console.log(`other thing ${value}`);
            } else {
                this.pushOperation(value);
                // Update display
                this.setLastNumberToDisplay();
            }
        } else {
            if(this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                //Number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                // Update display
                this.setLastNumberToDisplay();
            }
            
        }
    };

    setError() {
        this.displayCalc = "Error";
    };

    addDot() {
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === "string" && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    };

    initKeyboard() {
        
        document.addEventListener('keyup', e => {
            this.playAudio();
            switch(e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperatorion(e.key);
                case '=':
                case 'Enter':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperatorion(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
    
            }
        });
    };

    execBtn(value) {
        this.playAudio();
        switch(value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperatorion('+');
                break;
            case 'subtracao':
                this.addOperatorion('-');
                break;
            case 'divisao':
                this.addOperatorion('/');
                break;
            case 'multiplicacao':
                this.addOperatorion('*');
                break;
            case 'porcento':
                this.addOperatorion('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperatorion(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }
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
                this.execBtn(btn.className.baseVal.replace("btn-", ""));
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

    // Method that copy to clipboard the current operation on calculator
    copyToClipboard() {
        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    };

    /** 
     * Method that paste something into your clipboard and paste into calculator
     * This thing must be a number, otherwise NaN will appear on screen
    */ 
     
    pasteToClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
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
        if (arg.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = arg;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(arg) {
        this._currentDate = arg;
    }
}