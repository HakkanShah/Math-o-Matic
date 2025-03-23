// Get the display elements
const display = document.querySelector('.display');
const historyDisplay = document.querySelector('.history-display');

// Get all the buttons
const buttons = document.querySelectorAll('.buttons button');

// Calculator state
let currentValue = '';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;

// Add click event listener to each button
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;
        const action = button.dataset.action;
        
        if (action) {
            handleAction(action);
        } else {
            handleNumber(buttonText);
        }
    });
});

// Handle number inputs
function handleNumber(number) {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue += number;
    updateDisplay();
}

// Handle actions (operators, functions, etc.)
function handleAction(action) {
    switch(action) {
        case 'AC':
            clearAll();
            break;
        case 'C':
            clearLast();
            break;
        case '=':
            calculate();
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        case '^':
            handleOperator(action);
            break;
        case 'sin':
            calculateTrig('sin');
            break;
        case 'cos':
            calculateTrig('cos');
            break;
        case 'tan':
            calculateTrig('tan');
            break;
        case 'sqrt':
            calculateSqrt();
            break;
        case 'log':
            calculateLog();
            break;
        case 'ln':
            calculateLn();
            break;
        case 'pi':
            insertPi();
            break;
        case 'e':
            insertE();
            break;
    }
}

// Handle operators
function handleOperator(operator) {
    if (currentValue === '') return;
    
    if (previousValue !== '') {
        calculate();
    }
    
    operation = operator;
    previousValue = currentValue;
    currentValue = '';
    shouldResetDisplay = true;
    updateHistoryDisplay();
}

// Calculate result
function calculate() {
    if (previousValue === '' || currentValue === '') return;
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    currentValue = result.toString();
    operation = null;
    previousValue = '';
    shouldResetDisplay = true;
    updateDisplay();
    updateHistoryDisplay();
}

// Clear all
function clearAll() {
    currentValue = '';
    previousValue = '';
    operation = null;
    updateDisplay();
    updateHistoryDisplay();
}

// Clear last character
function clearLast() {
    currentValue = currentValue.slice(0, -1);
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.value = currentValue || '0';
}

// Update history display
function updateHistoryDisplay() {
    if (previousValue && operation) {
        historyDisplay.textContent = `${previousValue} ${operation}`;
    } else {
        historyDisplay.textContent = '';
    }
}

// Trigonometric functions
function calculateTrig(func) {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    const radians = value * Math.PI / 180;
    let result;
    
    switch(func) {
        case 'sin':
            result = Math.sin(radians);
            break;
        case 'cos':
            result = Math.cos(radians);
            break;
        case 'tan':
            result = Math.tan(radians);
            break;
    }
    
    currentValue = result.toString();
    shouldResetDisplay = true;
    updateDisplay();
}

// Square root
function calculateSqrt() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value >= 0) {
        currentValue = Math.sqrt(value).toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Logarithm
function calculateLog() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value > 0) {
        currentValue = Math.log10(value).toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Natural logarithm
function calculateLn() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value > 0) {
        currentValue = Math.log(value).toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Insert Pi
function insertPi() {
    currentValue = Math.PI.toString();
    shouldResetDisplay = true;
    updateDisplay();
}

// Insert Euler's number
function insertE() {
    currentValue = Math.E.toString();
    shouldResetDisplay = true;
    updateDisplay();
}