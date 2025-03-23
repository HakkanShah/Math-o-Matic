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
let isRadianMode = true;
let expression = '';

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
    expression += number;
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
        case 'del':
            deleteLast();
            break;
        case '=':
            calculate();
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
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
        case 'ms':
            memoryStore();
            break;
        case 'rad':
            toggleRadianMode();
            break;
        case 'fact':
            calculateFactorial();
            break;
        case '(':
            insertParenthesis('(');
            break;
        case ')':
            insertParenthesis(')');
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
    expression += operator;
    shouldResetDisplay = true;
    updateHistoryDisplay();
}

// Calculate result
function calculate() {
    if (previousValue === '' || currentValue === '') return;
    
    try {
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
            default:
                return;
        }
        
        // Format result to avoid floating point issues
        result = Number(result.toFixed(10));
        currentValue = result.toString();
        expression = currentValue;
        operation = null;
        previousValue = '';
        shouldResetDisplay = true;
        updateDisplay();
        updateHistoryDisplay();
    } catch (error) {
        currentValue = 'Error';
        updateDisplay();
    }
}

// Memory functions
function memoryClear() {
    memoryValue = 0;
    showMemoryNotification('Memory Cleared');
}

function memoryRecall() {
    if (memoryValue !== 0) {
        currentValue = memoryValue.toString();
        expression = currentValue;
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

function memoryStore() {
    if (currentValue !== '') {
        memoryValue = parseFloat(currentValue);
        showMemoryNotification('Stored in Memory');
    }
}

// Toggle between Radian and Degree mode
function toggleRadianMode() {
    isRadianMode = !isRadianMode;
    const radButton = document.querySelector('[data-action="rad"]');
    radButton.textContent = isRadianMode ? 'RAD' : 'DEG';
    showMemoryNotification(isRadianMode ? 'Radian Mode' : 'Degree Mode');
}

// Calculate factorial
function calculateFactorial() {
    if (currentValue === '') return;
    const num = parseInt(currentValue);
    if (num < 0 || !Number.isInteger(num)) {
        currentValue = 'Error';
        updateDisplay();
        return;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    currentValue = result.toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

// Insert parenthesis
function insertParenthesis(type) {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue += type;
    expression += type;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentValue.length > 0) {
        currentValue = currentValue.slice(0, -1);
        expression = expression.slice(0, -1);
        updateDisplay();
    }
}

// Clear all
function clearAll() {
    currentValue = '';
    previousValue = '';
    operation = null;
    expression = '';
    updateDisplay();
    updateHistoryDisplay();
}

// Clear last character
function clearLast() {
    currentValue = '';
    previousValue = '';
    operation = null;
    expression = '';
    updateDisplay();
    updateHistoryDisplay();
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
    let radians = value;
    
    if (!isRadianMode) {
        radians = value * Math.PI / 180;
    }
    
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
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

// Square root
function calculateSqrt() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value >= 0) {
        currentValue = Math.sqrt(value).toString();
        expression = currentValue;
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
        expression = currentValue;
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
        expression = currentValue;
        shouldResetDisplay = true;
        updateDisplay();
    } else {
        currentValue = 'Error';
        updateDisplay();
    }
}

// Insert Pi
function insertPi() {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue = Math.PI.toString();
    expression += Math.PI;
    updateDisplay();
}

// Insert Euler's number
function insertE() {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue = Math.E.toString();
    expression += Math.E;
    updateDisplay();
}

// Show memory notification
function showMemoryNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'memory-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}