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
let memoryValue = 0;

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
        case 'mc':
            memoryClear();
            break;
        case 'mr':
            memoryRecall();
            break;
        case 'm+':
            memoryAdd();
            break;
        case 'm-':
            memorySubtract();
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
            if (current === 0) {
                currentValue = 'Error';
                updateDisplay();
                return;
            }
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
    
    // Format result to avoid floating point issues
    result = Number(result.toFixed(10));
    currentValue = result.toString();
    operation = null;
    previousValue = '';
    shouldResetDisplay = true;
    updateDisplay();
    updateHistoryDisplay();
}

// Memory functions
function memoryClear() {
    memoryValue = 0;
    showMemoryNotification('Memory Cleared');
}

function memoryRecall() {
    if (memoryValue !== 0) {
        currentValue = memoryValue.toString();
        shouldResetDisplay = true;
        updateDisplay();
        showMemoryNotification('Memory Recalled');
    }
}

function memoryAdd() {
    if (currentValue !== '') {
        memoryValue += parseFloat(currentValue);
        showMemoryNotification('Added to Memory');
    }
}

function memorySubtract() {
    if (currentValue !== '') {
        memoryValue -= parseFloat(currentValue);
        showMemoryNotification('Subtracted from Memory');
    }
}

function showMemoryNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'memory-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
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
    
    result = Number(result.toFixed(10));
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
    } else {
        currentValue = 'Error';
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
    } else {
        currentValue = 'Error';
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
    } else {
        currentValue = 'Error';
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