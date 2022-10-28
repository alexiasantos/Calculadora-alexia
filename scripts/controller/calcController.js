class CalcController {
    constructor() {
        this._audio = new Audio('audio/click.mp3');
        this._locale = 'pt-BR';
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._audioOnOff = false;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#date");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }

    copyToClipboard() {
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

    }

    initialize() {
        this.setDisplayDateTime();
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-AC').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();

            });
        });
    }

    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;

    }
    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '/':
                case '-':
                case '%':
                case '*':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;

            }

        });
    }
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }


    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);


    }
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }
    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {

            this.calc();


        }
    }

    getResult() {
        try {
            return eval(this._operation.join(""));
        } catch (e) {
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }

    calc() {

        let last = '';
        this._lastOperator = this.getLastItem(true);

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) { // por padrão o isOperator e true

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) { // o false ou true pra pegar o ultimo item eu passo como argumento.
                lastItem = this._operation[i];
                break;
            }

        }
        if (!lastItem) {
            //sefor igual a true significa que queremos o ultimo operador senao estamos procurando o ultimo número (if ternário)
            lastItem = (isOperator) ? this._lastOperator : this.lastnumber;
        }
        return lastItem;
    }


    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addDot() {
        let lastOperation = this.getLastOperation();
        //       existe como string ?  e possui um ponto?
        if (typeof lastOperation === 'string' && lastOperation.split("").indexOf('.') > -1) return;
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }


    addOperation(value) {


        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);

            } else {

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();

                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }
        console.log(this._operation);

    }


    setError() {
        this.displayCalc = "Error";
    }

    execBtn(value) {
        this.playAudio();
        switch (value) {
            case 'AC':
                this.clearAll();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case 'mais':
                this.addOperation('+');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'menos':
                this.addOperation('-');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'vezes':
                this.addOperation('*');
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
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#botoes-conjunto > button");
        buttons.forEach((btn, index) => {
            btn.addEventListener("click", e => {

                let textBtn = btn.className.replace("btn-", "");

                this.execBtn(textBtn);

            })
        })

    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

    }
    // os getters e setters são utilizados para proteger seus dados, especialemnte na criação de classes.métodos de acesso e de modificação
    //Para cada instância de variável, um método getter retorna seu valor, enquanto um método setter o define ou atualiza
    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(value) {
        // innerHTML utilizado para adicionar um conteúdo a um elemento HTML que recebe em value
        this._dateEl.innerHTML = value; //O innerHTML é uma propriedade do Element que define ou retorna o conteúdo HTML de um elemento.

    }
    get displayCalc() {

        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value) {
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }
    get currentDate() {
        return new Date();

    }
    set currentDate(value) {
        this._currentDate = value;
    }


}

