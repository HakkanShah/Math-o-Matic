const display = document.querySelector('.display');
const historyDisplay = document.querySelector('.history-display');
const buttons = document.querySelectorAll('.buttons button');
const tabButtons = document.querySelectorAll('.tab-btn');
const standardButtons = document.querySelector('.buttons.standard');
const scientificButtons = document.querySelector('.buttons.scientific');
const themeButton = document.getElementById('themeButton');
const memoryStatus = document.querySelector('.memory-status');
const radDegDisplay = document.querySelector('.rad-deg');

let currentValue = '';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;
let memoryValue = 0;
let isRadianMode = true;
let expression = '';
let isDarkMode = false;

themeButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
});

tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
        tabButtons.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'standard') {
            standardButtons.classList.add('active');
            scientificButtons.classList.remove('active');
        } else {
            scientificButtons.classList.add('active');
            standardButtons.classList.remove('active');
        }
    });
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = '', 100);
        
        const buttonText = button.textContent;
        const action = button.dataset.action;
        
        if (action) {
            handleAction(action);
        } else {
            handleNumber(buttonText);
        }
    });
});

function handleNumber(number) {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue += number;
    expression += number;
    updateDisplay();
}

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
        // Trigonometric Functions
        case 'sin':
        case 'cos':
        case 'tan':
            calculateTrig(action);
            break;
        case 'asin':
        case 'acos':
        case 'atan':
            calculateInverseTrig(action);
            break;
        case 'sinh':
        case 'cosh':
        case 'tanh':
            calculateHyperbolicTrig(action);
            break;
        // Power and Root Functions
        case 'sqrt':
            calculateSqrt();
            break;
        case 'cbrt':
            calculateCbrt();
            break;
        case 'pow2':
            calculatePower(2);
            break;
        case 'pow3':
            calculatePower(3);
            break;
        // Logarithmic Functions
        case 'log':
            calculateLog();
            break;
        case 'ln':
            calculateLn();
            break;
        // Constants
        case 'pi':
            insertPi();
            break;
        case 'e':
            insertE();
            break;
        // Memory Functions
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
        // Special Functions
        case 'fact':
            calculateFactorial();
            break;
        case 'exp':
            handleExponential();
            break;
        case 'abs':
            calculateAbs();
            break;
        case '1/x':
            calculateReciprocal();
            break;
        case 'rand':
            insertRandom();
            break;
        case 'rad':
            toggleRadianMode();
            break;
        case '(':
        case ')':
            insertParenthesis(action);
            break;
    }
}

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
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            case '%':
                result = (prev * current) / 100;
                break;
            default:
                return;
        }
        
        result = formatResult(result);
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

function formatResult(number) {
    if (Number.isInteger(number)) return number;
    return Number(number.toFixed(10));
}

function memoryClear() {
    memoryValue = 0;
    updateMemoryStatus();
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
        updateMemoryStatus();
        showMemoryNotification('Added to Memory');
    }
}

function memorySubtract() {
    if (currentValue !== '') {
        memoryValue -= parseFloat(currentValue);
        updateMemoryStatus();
        showMemoryNotification('Subtracted from Memory');
    }
}

function updateMemoryStatus() {
    memoryStatus.textContent = memoryValue !== 0 ? 'M' : '';
}

function calculateTrig(func) {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    let radians = isRadianMode ? value : (value * Math.PI / 180);
    
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
    
    currentValue = formatResult(result).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateInverseTrig(func) {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    
    let result;
    switch(func) {
        case 'asin':
            result = Math.asin(value);
            break;
        case 'acos':
            result = Math.acos(value);
            break;
        case 'atan':
            result = Math.atan(value);
            break;
    }
    
    if (!isRadianMode) {
        result = result * 180 / Math.PI;
    }
    
    currentValue = formatResult(result).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateHyperbolicTrig(func) {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    
    let result;
    switch(func) {
        case 'sinh':
            result = Math.sinh(value);
            break;
        case 'cosh':
            result = Math.cosh(value);
            break;
        case 'tanh':
            result = Math.tanh(value);
            break;
    }
    
    currentValue = formatResult(result).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateSqrt() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value >= 0) {
        currentValue = formatResult(Math.sqrt(value)).toString();
        expression = currentValue;
        shouldResetDisplay = true;
        updateDisplay();
    } else {
        currentValue = 'Error';
        updateDisplay();
    }
}

function calculateCbrt() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    currentValue = formatResult(Math.cbrt(value)).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculatePower(power) {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    currentValue = formatResult(Math.pow(value, power)).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateLog() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value > 0) {
        currentValue = formatResult(Math.log10(value)).toString();
        expression = currentValue;
        shouldResetDisplay = true;
        updateDisplay();
    } else {
        currentValue = 'Error';
        updateDisplay();
    }
}

function calculateLn() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value > 0) {
        currentValue = formatResult(Math.log(value)).toString();
        expression = currentValue;
        shouldResetDisplay = true;
        updateDisplay();
    } else {
        currentValue = 'Error';
        updateDisplay();
    }
}

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
    currentValue = formatResult(result).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateAbs() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    currentValue = formatResult(Math.abs(value)).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateReciprocal() {
    if (currentValue === '') return;
    const value = parseFloat(currentValue);
    if (value === 0) {
        currentValue = 'Error';
        updateDisplay();
        return;
    }
    currentValue = formatResult(1 / value).toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function handleExponential() {
    if (currentValue === '') return;
    currentValue += 'e';
    expression += 'e';
    updateDisplay();
}

function insertRandom() {
    currentValue = Math.random().toString();
    expression = currentValue;
    shouldResetDisplay = true;
    updateDisplay();
}

function toggleRadianMode() {
    isRadianMode = !isRadianMode;
    radDegDisplay.textContent = isRadianMode ? 'RAD' : 'DEG';
    showMemoryNotification(isRadianMode ? 'Radian Mode' : 'Degree Mode');
}

function clearAll() {
    currentValue = '';
    previousValue = '';
    operation = null;
    expression = '';
    updateDisplay();
    updateHistoryDisplay();
}

function clearLast() {
    currentValue = '';
    updateDisplay();
}

function deleteLast() {
    if (currentValue.length > 0) {
        currentValue = currentValue.slice(0, -1);
        expression = expression.slice(0, -1);
        updateDisplay();
    }
}

function insertParenthesis(type) {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue += type;
    expression += type;
    updateDisplay();
}

function insertPi() {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue = Math.PI.toString();
    expression += Math.PI;
    updateDisplay();
}

function insertE() {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }
    currentValue = Math.E.toString();
    expression += Math.E;
    updateDisplay();
}

function updateDisplay() {
    display.value = currentValue || '0';
}

function updateHistoryDisplay() {
    if (previousValue && operation) {
        historyDisplay.textContent = `${previousValue} ${operation}`;
    } else {
        historyDisplay.textContent = '';
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

updateMemoryStatus();