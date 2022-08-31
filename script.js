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
    var res = 0;

    if (new RegExp("add", 'gi').test(operator))
        res = add(a, b);
    else if (new RegExp("sub", 'gi').test(operator))
        res = sub(a, b);
    else if (new RegExp("multiply", 'gi').test(operator))
        res = multiply(a, b);
    else if (new RegExp("divide", 'gi').test(operator))
        res = divide(a, b);
    else res = undefined;

    return res;
}