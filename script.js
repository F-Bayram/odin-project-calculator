const DISPLAY = document.querySelector(".display");
const OPERATOR_LIST = document.querySelectorAll("button.operator");
const DIGIT_LIST = document.querySelectorAll("button.digit");
const COMMA_BTN = document.querySelector(".comma");
const EXPRESSION_DISPLAY = document.querySelector(".expression");
const RESULT_DISPLAY = document.querySelector(".result");

const BASIC_COLOR = "#F5E8C7";
const SELECTED_COLOR = "#F6E7D8";
const MAX_OPERAND_LENGTH = 9;
const EMPTY = "";

var curExp = "0";
var result = "";

function add(a, b){
    return a+b;
}

function sub(a, b){
    return a-b;
}

function multiply(a, b){
    return a*b;
}

function divide(a, b){
    return b == 0 ? undefined : a/b;
}

function operate(operator, a, b){
    a = parseFloat(a);
    b = parseFloat(b);
    var res = null;

    switch(operator)
    {
        case '+':
            res = add(a, b);
            break;
        case '-':
            res = sub(a, b);
            break;
        case '×':
            res = multiply(a, b);
            break;
        case '÷':
            res = divide(a, b);
            break;
        default:
            console.log("The operator is not supported!");
            break;
    }

    res = Math.round(res * 1000) / 1000;
        
    return res;
}

function updateDisplay(content){
    EXPRESSION_DISPLAY.textContent = content;
}

function clearDisplay(){
    disselectOperator(getOperator());
    curExp = "0";
    updateDisplay(curExp);
    result = EMPTY;
    updateResult(result);
    document.querySelector(".comma").disabled = false;
}

function delDisplay(){
    const LAST_CHAR = curExp[curExp.length-1];
    if (curExp.length > 1){
        const CUR_OPERATOR = getOperator();
        if (LAST_CHAR == CUR_OPERATOR){
            disselectOperator(CUR_OPERATOR);
            if (isCommaFound(getLastOperand()))
                COMMA_BTN.disabled = true;
        }
        curExp = curExp.substring(0, curExp.length-1);
    }
    else if(curExp.length == 1)
        curExp = "0";
    if (LAST_CHAR == ',')
        enableButton(COMMA_BTN);
    updateDisplay(curExp);
}

function evalExp(){
    const EXP = curExp;
    const PATTERN = /^\d+(?:\,\d+)?(?:[\+\-×÷]\d+(?:\,\d+)?)+$/g;
    return PATTERN.test(EXP);
}

function disableButton(btn){
    btn.disabled = true;
}

function enableButton(btn){
    btn.disabled = false;
}

function writeDigitOnDisplay(e, key){
    if (result != EMPTY){
        result = EMPTY;
        updateResult(result);
        if (!curExp[curExp.length-1].match(/[\+\-×÷]/)){
            curExp = "0";
            updateDisplay(curExp);
            enableButton(COMMA_BTN);
        }
    }
    const DIGIT = key == null ? e.target.getAttribute("data-content") : key;
    const CUR_OPERAND = getLastOperand();
    const LAST_CHAR = curExp[curExp.length-1];
    const COMMA_FOUND = isCommaFound(CUR_OPERAND);
    /* don't allow more than one decimal point
    if (COMMA_FOUND && LAST_CHAR != "," && !LAST_CHAR.match(/[\+\-×÷]/))
        return;*/
    if (CUR_OPERAND.length == MAX_OPERAND_LENGTH && !LAST_CHAR.match(/[\+\-×÷]/))
        return;
    // if operand's first digit is an zero, prevent more zeros and remove the zero if a non-zero digit is clicked
    if (CUR_OPERAND[0] == '0' && CUR_OPERAND.length == 1 && !LAST_CHAR.match(/[\+\-×÷]/)){
        if (DIGIT == 0)
            return;
        else if (!COMMA_FOUND && DIGIT != ',')
            curExp = curExp.substring(0, curExp.length-1);
    }

    // disable comma button if clicked once for current operand
    if (DIGIT == ',' && !COMMA_FOUND && !LAST_CHAR.match(/[\+\-×÷]/))
        disableButton(COMMA_BTN);
    // prevents writing more than one comma
    if (DIGIT == ',' && (LAST_CHAR == ',' || LAST_CHAR.match(/[\+\-×÷]/) || CUR_OPERAND.match(/\./g))){
        return;
    }

    curExp += DIGIT;

    updateDisplay(curExp);
}

function isCommaFound(exp){
    return exp.match(/\./g);
}

function selectOperator(operator){
    for (const OP_OBJ of OPERATOR_LIST){
        if (OP_OBJ.getAttribute("data-content") == operator)
            OP_OBJ.style.backgroundColor = SELECTED_COLOR;
    }
}

function disselectOperator(operator){
    for (const OP_OBJ of OPERATOR_LIST){
        if (OP_OBJ.getAttribute("data-content") == operator)
            OP_OBJ.style.backgroundColor = BASIC_COLOR;
    }
}

function swapOperator(oldOp, newOp){
    disselectOperator(oldOp);
    selectOperator(newOp);
}

function getOperator(){
    const EXP = curExp.replace(/\,/g, '.');
    return EXP.match(/[\+\-×÷]/g) != null ? EXP.match(/[\+\-×÷]/g)[0] : null;
}

function getOperands(){
    const EXP = curExp.replace(/\,/g, '.');
    return EXP.match(/\d+\.?\d*/g);
}

function getLastOperand(){
    return getOperands() != null ? getOperands()[getOperands().length-1] : "";
}

function processOperation(e, key){
    const EXP = curExp.replace(',', '.');

    key = key === '*' ? '×' : key === '/' ? '÷' : key;  
    
    const OPERANDS = getOperands();
    const CUR_OPERATOR =  getOperator();
    const CLICKED_OPERATOR = key ? key : e.target.getAttribute("data-content");
    
    enableButton(COMMA_BTN);
    if (OPERANDS.length == 1){        
        if (!CUR_OPERATOR){
            selectOperator(CLICKED_OPERATOR);
            curExp += CLICKED_OPERATOR;
        }
        else if(CUR_OPERATOR == CLICKED_OPERATOR){
            const OPERAND = OPERANDS[0];
            curExp = operate(CUR_OPERATOR, OPERAND, OPERAND).toString().replace(/\./g, ',') + CUR_OPERATOR;
            if (!curExp.match(/\d+/)) divisionByZero();
            else result = curExp;
            updateResult(result);
            updateDisplay(curExp);
        }
        else{
            swapOperator(CUR_OPERATOR, CLICKED_OPERATOR);
            curExp = curExp.substring(0, curExp.length-1);
            curExp += CLICKED_OPERATOR;
        }
        updateDisplay(curExp);
    }
    else if (OPERANDS.length > 1){
        curExp = operate(CUR_OPERATOR, OPERANDS[0], OPERANDS[1]).toString().replace(/\./g, ',') + CLICKED_OPERATOR;
        if (!curExp.match(/\d+/)) divisionByZero();
        else{
            result = curExp;
            curExp = curExp.substring(0, curExp.length-1);
            curExp += CLICKED_OPERATOR;
        }
        updateResult(result);
        disselectOperator(CUR_OPERATOR);
        selectOperator(CLICKED_OPERATOR);
        updateDisplay(curExp);
    }
}

function processCalc(){
    const OPERANDS = getOperands();
    const CUR_OPERATOR =  getOperator();

    if (OPERANDS.length == 1){
        if (OPERANDS[0][OPERANDS[0].length-1].match(/[\.]/g)){
            curExp = curExp.substring(0, curExp.length-1);
            enableButton(COMMA_BTN);
        }
        else curExp = OPERANDS[0].replace('.', ',');
    }   
    else{
        curExp = operate(CUR_OPERATOR, OPERANDS[0], OPERANDS[1]).toString().replace(/\./g, ',');
        if (!curExp.match(/\d+/)) divisionByZero();
        else result = curExp;
        updateResult(result);
    }
    
    disselectOperator(CUR_OPERATOR);
}

function processKeyInput(e){
    const BUTTON_KEY = e.key;
    const EQUALS = '=';
    const DEL = "Backspace";
    const CLEAR = "Delete";

    if (BUTTON_KEY === EQUALS)
        processCalc()
    else if (BUTTON_KEY === DEL)
        delDisplay();
    else if(BUTTON_KEY === CLEAR)
        clearDisplay();
}

function processOpKeyInput(e){
    const BUTTON_KEY = e.key;
    const NUMBER_PATTERN = /\d+/;
    const OPERATOR_PATTERN = /[\+\-\*\/]/;

    if (NUMBER_PATTERN.test(BUTTON_KEY) || BUTTON_KEY === ',')
        writeDigitOnDisplay(e, BUTTON_KEY);
    else if(OPERATOR_PATTERN.test(BUTTON_KEY))
        processOperation(e, BUTTON_KEY);
}

function updateResult(result){
    result = result.match(/[\+\-×÷]/g) ? result.substring(0, result.length-1) : result;
    RESULT_DISPLAY.textContent = result;
}

function divisionByZero(){
    result = "Say what?";
    curExp = '0';
}

DIGIT_LIST.forEach(digit => {
    digit.setAttribute("data-content", digit.textContent);
    digit.addEventListener("click", writeDigitOnDisplay);
});

OPERATOR_LIST.forEach(operator => {
    operator.setAttribute("data-content", operator.textContent);
    operator.addEventListener("click", processOperation);
});

document.querySelector(".equals").addEventListener("click", processCalc);
document.querySelector(".clear").addEventListener("click", clearDisplay);
document.querySelector(".delete").addEventListener("click", delDisplay);
window.addEventListener("keypress", processOpKeyInput);
window.addEventListener("keydown", processKeyInput);