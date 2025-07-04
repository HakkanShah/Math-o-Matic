const display = document.querySelector('.display');
const historyDisplay = document.querySelector('.history-display');
const buttons = document.querySelectorAll('.buttons button');
const tabButtons = document.querySelectorAll('.tab-btn');
const standardButtons = document.querySelector('.buttons.standard');
const scientificButtons = document.querySelector('.buttons.scientific');
const themeButton = document.getElementById('themeButton');
const memoryStatus = document.querySelector('.memory-status');
const radDegDisplay = document.querySelector('.rad-deg');
const buttonTapSound = document.getElementById('buttonTap');
const converterType = document.querySelector('.converter-type');
const converterValue = document.querySelector('.converter-value');
const converterResult = document.querySelector('.converter-result');
const converterFrom = document.querySelector('.converter-from');
const converterTo = document.querySelector('.converter-to');
const converterSwap = document.querySelector('.converter-swap');
const converterClear = document.querySelector('.converter-clear');
const converterCopy = document.querySelector('.converter-copy');

const buttonTap = document.getElementById('buttonTap');
const numberTap = document.getElementById('numberTap');
const operatorTap = document.getElementById('operatorTap');
const functionTap = document.getElementById('functionTap');
const memoryTap = document.getElementById('memoryTap');
const clearTap = document.getElementById('clearTap');

let currentValue = '';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;
let memoryValue = 0;
let isRadianMode = true;
let expression = '';
let isDarkMode = true;

const themeToggle = document.querySelector('.theme-toggle');
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    if (e.target === themeToggle || themeToggle.contains(e.target)) {
        isDragging = true;
        themeToggle.classList.add('dragging');
        
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
}
function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
   themeToggle.classList.remove('dragging');
    
    if (navigator.vibrate) {
        navigator.vibrate(5);
    }
}
function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
       
        const buttonRect = themeToggle.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;
        
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
    
        const maxX = (windowWidth - buttonWidth) / 2;
        const maxY = windowHeight - buttonHeight - 20;
       
     
        currentX = Math.max(-maxX, Math.min(maxX, currentX));
        currentY = Math.max(-maxY, Math.min(0, currentY));

        xOffset = currentX;
        yOffset = currentY;
        
        themeToggle.style.transition = 'none';
        setTranslate(currentX, currentY, themeToggle);
    }
}
themeToggle.addEventListener('touchstart', () => {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
});

function loadPosition() {
    const savedPosition = localStorage.getItem('themeTogglePosition');
    if (savedPosition) {
        const position = JSON.parse(savedPosition);
        const buttonRect = themeToggle.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
    
        const maxX = (windowWidth - buttonRect.width) / 2;
        const maxY = windowHeight - buttonRect.height - 20;
        
      
        xOffset = Math.max(-maxX, Math.min(maxX, position.x));
        yOffset = Math.max(-maxY, Math.min(0, position.y));
       
      
        themeToggle.style.transition = 'transform 0.2s ease';
        setTranslate(xOffset, yOffset, themeToggle);
        
       
        setTimeout(() => {
            themeToggle.style.transition = 'box-shadow 0.2s ease';
        }, 200);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

themeToggle.addEventListener("touchstart", dragStart, false);
themeToggle.addEventListener("touchend", dragEnd, false);
themeToggle.addEventListener("touchmove", drag, false);

themeToggle.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

function savePosition() {
    localStorage.setItem('themeTogglePosition', JSON.stringify({
        x: xOffset,
        y: yOffset
    }));
}

themeToggle.addEventListener("mouseup", savePosition);
themeToggle.addEventListener("touchend", savePosition);

document.addEventListener('DOMContentLoaded', loadPosition);

const unitConversions = {
    length: {
        units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
        conversions: {
            'Meters': 1,
            'Kilometers': 1000,
            'Centimeters': 0.01,
            'Millimeters': 0.001,
            'Miles': 1609.34,
            'Yards': 0.9144,
            'Feet': 0.3048,
            'Inches': 0.0254
        }
    },
    weight: {
        units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces'],
        conversions: {
            'Kilograms': 1,
            'Grams': 0.001,
            'Milligrams': 0.000001,
            'Pounds': 0.453592,
            'Ounces': 0.0283495
        }
    },
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        conversions: {
            'Celsius': 1,
            'Fahrenheit': 1,
            'Kelvin': 1
        }
    },
    area: {
        units: ['Square Meters', 'Square Kilometers', 'Square Miles', 'Acres', 'Square Yards', 'Square Feet'],
        conversions: {
            'Square Meters': 1,
            'Square Kilometers': 1000000,
            'Square Miles': 2589988.11,
            'Acres': 4046.86,
            'Square Yards': 0.836127,
            'Square Feet': 0.092903
        }
    },
    volume: {
        units: ['Liters', 'Milliliters', 'Cubic Meters', 'Gallons', 'Quarts', 'Pints', 'Cups', 'Fluid Ounces'],
        conversions: {
            'Liters': 1,
            'Milliliters': 0.001,
            'Cubic Meters': 1000,
            'Gallons': 3.78541,
            'Quarts': 0.946353,
            'Pints': 0.473176,
            'Cups': 0.236588,
            'Fluid Ounces': 0.0295735
        }
    },
    speed: {
        units: ['Meters per Second', 'Kilometers per Hour', 'Miles per Hour', 'Knots'],
        conversions: {
            'Meters per Second': 1,
            'Kilometers per Hour': 0.277778,
            'Miles per Hour': 0.44704,
            'Knots': 0.514444
        }
    },
    time: {
        units: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'],
        conversions: {
            'Seconds': 1,
            'Minutes': 60,
            'Hours': 3600,
            'Days': 86400,
            'Weeks': 604800,
            'Months': 2629746,
            'Years': 31556952
        }
    },
    data: {
        units: ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes'],
        conversions: {
            'Bytes': 1,
            'Kilobytes': 1024,
            'Megabytes': 1048576,
            'Gigabytes': 1073741824,
            'Terabytes': 1099511627776
        }
    }
};

themeButton.addEventListener('click', () => {
    requestAnimationFrame(() => {
        isDarkMode = !isDarkMode;
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    });
});

tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
        requestAnimationFrame(() => {
            tabButtons.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            
            standardButtons.classList.remove('active');
            scientificButtons.classList.remove('active');
            document.querySelector('.buttons.converter').classList.remove('active');
            
            // Show selected section
            if (tab.dataset.tab === 'standard') {
                standardButtons.classList.add('active');
                document.querySelector('.display-container').style.display = 'flex';
                display.style.display = 'block';
                historyDisplay.style.display = 'block';
            } else if (tab.dataset.tab === 'scientific') {
                scientificButtons.classList.add('active');
                document.querySelector('.display-container').style.display = 'flex';
                display.style.display = 'block';
                historyDisplay.style.display = 'block';
            } else if (tab.dataset.tab === 'converter') {
                document.querySelector('.buttons.converter').classList.add('active');
                document.querySelector('.display-container').style.display = 'none';
                display.style.display = 'none';
                historyDisplay.style.display = 'none';
                // Reset calculator display when switching to converter
                currentValue = '';
                previousValue = '';
                operation = null;
                expression = '';
            }
        });
    });
});

function playSound(soundElement) {
    if (soundElement.readyState >= 2) {
        soundElement.currentTime = 0;
        soundElement.play().catch(() => {});
    }
}

// Set initial volumes
function setVolume(element, volume) {
    element.volume = volume; // 0.0 to 1.0
}

// Set volumes for different sounds
setVolume(numberTap, 0.3);
setVolume(operatorTap, 0.4);
setVolume(functionTap, 0.3);
setVolume(memoryTap, 0.4);
setVolume(clearTap, 0.5);

// Update button click handler
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Add pressed class for visual feedback
        button.classList.add('pressed');
        
       
        if (button.classList.contains('number-btn')) {
            playSound(numberTap);
        } else if (button.classList.contains('operator-btn')) {
            playSound(operatorTap);
        } else if (button.classList.contains('function-btn')) {
            playSound(functionTap);
        } else if (button.classList.contains('memory-btn')) {
            playSound(memoryTap);
        } else if (button.classList.contains('clear-btn')) {
            playSound(clearTap);
        } else {
            playSound(buttonTapSound);
        }
        
        // Remove pressed class after animation
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 100);
        
        const buttonText = button.textContent;
        const action = button.dataset.action;
        
        // Use requestAnimationFrame for smoother UI updates
        requestAnimationFrame(() => {
            if (action) {
                handleAction(action);
            } else {
                handleNumber(buttonText);
            }
        });
    });
});

// Add keyboard support
document.addEventListener('keydown', (event) => {
    // Check if we're in converter mode
    const isConverterActive = document.querySelector('.buttons.converter').classList.contains('active');
    if (isConverterActive) {
        // Handle converter keyboard input
        if (event.key === 'Enter') {
            convert();
        } else if (event.key === 'Escape') {
            clearConverter();
        } else if (event.key === 'c' || event.key === 'C') {
            copyResult();
        }
        return;
    }

    // Prevent default behavior for calculator keys
    if (isCalculatorKey(event.key)) {
        event.preventDefault();
    }

    // Handle number keys
    if (/^[0-9.]$/.test(event.key)) {
        handleNumber(event.key);
    }
    
    // Handle operators
    switch(event.key) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
            handleOperator(event.key);
            break;
            
        case 'Enter':
        case '=':
            calculate();
            break;
            
        case 'Backspace':
            deleteLast();
            break;
            
        case 'Escape':
            clearAll();
            break;
            
        case 'c':
        case 'C':
            clearLast();
            break;
            
        case 'm':
        case 'M':
            if (event.ctrlKey) {
                memoryClear();
            } else if (event.altKey) {
                memoryRecall();
            } else if (event.shiftKey) {
                memoryAdd();
            } else {
                memorySubtract();
            }
            break;
            
        case 'p':
        case 'P':
            insertPi();
            break;
            
        case 'e':
        case 'E':
            insertE();
            break;
            
        case 'r':
        case 'R':
            insertRandom();
            break;
            
        case 's':
        case 'S':
            if (event.ctrlKey) {
                calculateSqrt();
            } else if (event.altKey) {
                calculateSin();
            }
            break;
            
        case 't':
        case 'T':
            if (event.ctrlKey) {
                calculateTan();
            }
            break;
            
        case 'l':
        case 'L':
            if (event.ctrlKey) {
                calculateLog();
        } else {
                calculateLn();
            }
            break;
            
        case 'd':
        case 'D':
            toggleRadianMode();
            break;
    }
});

// Function to check if key is used by calculator
function isCalculatorKey(key) {
    const calculatorKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '.', '+', '-', '*', '/', '%', '=', 'Enter', 'Backspace',
        'Escape', 'c', 'C', 'm', 'M', 'p', 'P', 'e', 'E', 'r', 'R',
        's', 'S', 't', 'T', 'l', 'L', 'd', 'D'
    ];
    return calculatorKeys.includes(key);
}

// Add visual feedback for keyboard input
function simulateButtonPress(action) {
    const button = document.querySelector(`[data-action="${action}"]`);
    if (button) {
        requestAnimationFrame(() => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = '', 50);
        });
    }
}

function handleNumber(number) {
    // Only handle numbers when not in converter mode
    if (!document.querySelector('.buttons.converter').classList.contains('active')) {
        if (shouldResetDisplay) {
            currentValue = '';
            shouldResetDisplay = false;
        }
        currentValue += number;
        expression += number;
        updateDisplay();
        
        // Simulate button press
        const button = Array.from(buttons).find(btn => btn.textContent === number);
        if (button) {
            requestAnimationFrame(() => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => button.style.transform = '', 50);
            });
        }
    }
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
    
    // Simulate button press
    simulateButtonPress(operator);
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
    requestAnimationFrame(() => {
        memoryStatus.textContent = memoryValue !== 0 ? 'M' : '';
    });
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
    // Only update display when not in converter mode
    if (!document.querySelector('.buttons.converter').classList.contains('active')) {
        requestAnimationFrame(() => {
            display.value = currentValue || '0';
        });
    }
}

function updateHistoryDisplay() {
    // Only update history display when not in converter mode
    if (!document.querySelector('.buttons.converter').classList.contains('active')) {
        requestAnimationFrame(() => {
            if (previousValue && operation) {
                historyDisplay.textContent = `${previousValue} ${operation}`;
            } else {
                historyDisplay.textContent = '';
            }
        });
    }
}

function showMemoryNotification(message, isConverter = false) {
    // Only show notifications for calculator actions
    if (isConverter) return;
    
    const notification = document.createElement('div');
    notification.className = 'memory-notification';
    notification.textContent = message;
    
    // Append to display container instead of body
    const displayContainer = document.querySelector('.display-container');
    displayContainer.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.animation = 'fadeInOut 2s ease forwards';
    });
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Initialize Unit Converter
function initializeConverter() {
    updateUnitOptions();
    converterType.addEventListener('change', () => {
        updateUnitOptions();
        convert();
    });
    converterValue.addEventListener('input', convert);
    converterFrom.addEventListener('change', convert);
    converterTo.addEventListener('change', convert);
    converterSwap.addEventListener('click', swapUnits);
    converterClear.addEventListener('click', clearConverter);
    converterCopy.addEventListener('click', copyResult);
}

// Update Unit Options
function updateUnitOptions() {
    const type = converterType.value;
    const units = unitConversions[type].units;
    
    // Clear existing options
    converterFrom.innerHTML = '';
    converterTo.innerHTML = '';
    
    // Add new options
    units.forEach(unit => {
        const fromOption = new Option(unit, unit);
        const toOption = new Option(unit, unit);
        converterFrom.add(fromOption);
        converterTo.add(toOption);
    });
    
    // Set default selections
    converterFrom.value = units[0];
    converterTo.value = units[1];
    
    // Clear previous values
    converterValue.value = '';
    converterResult.value = '';
}

// Convert Units
function convert() {
    const type = converterType.value;
    const value = parseFloat(converterValue.value) || 0;
    const fromUnit = converterFrom.value;
    const toUnit = converterTo.value;
    
    let result;
    
    if (type === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        const baseValue = value * unitConversions[type].conversions[fromUnit];
        result = baseValue / unitConversions[type].conversions[toUnit];
    }
    
    // Format result based on type
    if (type === 'temperature') {
        converterResult.value = result.toFixed(2);
    } else if (type === 'data') {
        converterResult.value = result.toFixed(2);
    } else {
        converterResult.value = result.toFixed(6);
    }
}

// Convert Temperature
function convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    
    // Convert to Celsius first
    switch(fromUnit) {
        case 'Celsius':
            celsius = value;
            break;
        case 'Fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'Kelvin':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target unit
    switch(toUnit) {
        case 'Celsius':
            return celsius;
        case 'Fahrenheit':
            return (celsius * 9/5) + 32;
        case 'Kelvin':
            return celsius + 273.15;
    }
}

// Swap Units
function swapUnits() {
    if (document.querySelector('.buttons.converter').classList.contains('active')) {
        const temp = converterFrom.value;
        converterFrom.value = converterTo.value;
        converterTo.value = temp;
        
        // Also swap the values if they exist
        if (converterValue.value && converterResult.value) {
            const tempValue = converterValue.value;
            converterValue.value = converterResult.value;
            converterResult.value = tempValue;
        }
        
        convert();
    }
}

// Clear Converter
function clearConverter() {
    if (document.querySelector('.buttons.converter').classList.contains('active')) {
        converterValue.value = '';
        converterResult.value = '';
    }
}

// Copy Result
function copyResult() {
    if (document.querySelector('.buttons.converter').classList.contains('active') && converterResult.value) {
        converterResult.select();
        document.execCommand('copy');
    }
}

// Initialize converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeConverter();
});

updateMemoryStatus();