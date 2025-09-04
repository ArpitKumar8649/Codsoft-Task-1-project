class Calculator {
    constructor() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.history = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.displayElement = document.getElementById('display');
        this.operationDisplayElement = document.getElementById('operation-display');
        this.historyListElement = document.getElementById('history-list');
        this.clearHistoryButton = document.getElementById('clear-history');
        this.buttons = document.querySelectorAll('.btn');
    }

    attachEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        this.clearHistoryButton.addEventListener('click', () => {
            this.clearHistory();
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    handleButtonClick(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;

        switch (action) {
            case 'number':
                this.inputNumber(value);
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'operation':
                this.performOperation(value);
                break;
            case 'equals':
                this.performCalculation();
                break;
            case 'clear':
                this.clear();
                break;
        }

        this.updateDisplay();
    }

    handleKeyPress(e) {
        e.preventDefault();
        
        if (e.key >= '0' && e.key <= '9') {
            this.inputNumber(e.key);
        } else if (e.key === '.') {
            this.inputDecimal();
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            this.performOperation(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            this.performCalculation();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.backspace();
        }

        this.updateDisplay();
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.display = String(num);
            this.waitingForOperand = false;
        } else {
            this.display = this.display === '0' ? String(num) : this.display + num;
        }
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.display = '0.';
            this.waitingForOperand = false;
        } else if (this.display.indexOf('.') === -1) {
            this.display += '.';
        }
    }

    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
    }

    backspace() {
        if (!this.waitingForOperand) {
            this.display = this.display.slice(0, -1) || '0';
        }
    }

    performOperation(nextOperation) {
        const inputValue = parseFloat(this.display);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation) {
            const currentValue = this.previousValue || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operation);

            // Add to history
            const calculation = `${this.formatNumber(currentValue)} ${this.operation} ${this.formatNumber(inputValue)} = ${this.formatNumber(newValue)}`;
            this.addToHistory(calculation);

            this.display = String(newValue);
            this.previousValue = newValue;
        }

        this.waitingForOperand = true;
        this.operation = nextOperation;
    }

    performCalculation() {
        const inputValue = parseFloat(this.display);

        if (this.previousValue !== null && this.operation) {
            const newValue = this.calculate(this.previousValue, inputValue, this.operation);
            
        
            const calculation = `${this.formatNumber(this.previousValue)} ${this.operation} ${this.formatNumber(inputValue)} = ${this.formatNumber(newValue)}`;
            this.addToHistory(calculation);

            this.display = String(newValue);
            this.previousValue = null;
            this.operation = null;
            this.waitingForOperand = true;
        }
    }

    calculate(firstOperand, secondOperand, operation) {
        switch (operation) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return secondOperand !== 0 ? firstOperand / secondOperand : 0;
            default:
                return secondOperand;
        }
    }

    formatNumber(num) {
       
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return parseFloat(num.toFixed(10)).toString();
    }

    addToHistory(calculation) {
        this.history.unshift(calculation);
        
       
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    updateDisplay() {
        this.displayElement.textContent = this.display;
        
        if (this.operation && this.previousValue !== null) {
            this.operationDisplayElement.textContent = `${this.formatNumber(this.previousValue)} ${this.operation}`;
        } else {
            this.operationDisplayElement.textContent = '';
        }
    }

    updateHistoryDisplay() {
        this.historyListElement.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyListElement.innerHTML = `
                <div class="no-history">
                    <svg class="history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                        <path d="M12 7v5l4 2"/>
                    </svg>
                    <p>No calculations yet</p>
                    <p class="sub-text">Start calculating to see history</p>
                </div>
            `;
        } else {
            this.history.forEach(calculation => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = calculation;
                this.historyListElement.appendChild(historyItem);
            });
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
