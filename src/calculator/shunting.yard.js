import Calc from "./calc";


const operators = ['+','-','/','*'];
const precedence = {
    '(': 1,
    ')': 1,
    '-': 2,
    '+': 2,
    '*': 3,
    '/': 3,
};

export default class ShuntingYard { 
    // Hold the current value
    holder = "";

    outputStack = [];
    operatorStack = [];

    // Track the equation as a whole
    equation = "";
    engine = new Calc();

    addSymbol(symbol){
        if(Calc.isNumber(symbol))
            return this.addToHolder(symbol);
    
        switch(symbol){
            case '-':
                // This is assuming that the value will be a negative number
                if(this.holder.length === 0)
                    return this.addToHolder(symbol);
                // eslint-disable-next-line
            case '*':
            case '/':
            case '+':
                return this.addOperator(symbol);
            case '.':
                // Check that there is only 1 decimal point
                if(this.holder.indexOf(symbol) === -1)
                    return this.addToHolder(symbol);
                else
                    throw new Error('Cannot have 2 Decimal points in the same number');
            case '(':
                return this.addLeftBracket();
            case ')':
                return this.addRightBracket();
            default:
                break;
        }
        throw new Error('Unrecognized symbol');
    }

     //Add to holder (this manages also unsetting error state)
     addToHolder(val){
        if(this.equation[this.equation.length - 1] !== ')'){
            this.holder += val;
            this.equation += val;
            return this.equation;
        }
        throw new Error('A mathematical operator must proceed a closing bracket');
    }


    // Helper function, to see if the character is an operator
    isOperator(val){
        return operators.indexOf(val) !== -1;
    }

    addOperator(op){
        // Stops adding multiple concurrent operators (like ++ or -- which although legal, is not being considered
        // in this implementation as legal)
        if(!this.isOperator(this.equation[this.equation.length - 1])){            
            this.addHolderToArray(this.outputStack);
            var end = this.operatorStack.length - 1;
            if(precedence[this.operatorStack[end]] >= precedence[op] && this.operatorStack[end] !== '(')
                this.outputStack.push(this.operatorStack.pop());
            
            this.operatorStack.push(op);
            this.equation += op;
            return this.equation;
        }
        throw new Error('Operator will make equation invalid');
    }

    addLeftBracket(){
        // Need to make sure that adding the bracket is allowed to be done (we aren't considering placing
        // a bracket next to something implies multiplication in this implementation

         // If this isn't the start of the equation, and this will be placed infront of a number
        if((this.equation.length !== 0 && Calc.isNumber(this.equation[this.equation.length - 1])))
            throw new Error('An opening bracket is only allowed either after an operator or at the start of an equation');
        // Or it's going to make an empty pair of brakets
        if(this.equation[this.equation.length - 1] === ')')
            throw new Error('An opening bracket after a closing bracket does not imply multiplication');

        this.operatorStack.push('(');
        this.equation += '(';
        return this.equation;
    }

    addRightBracket(){        
        // Don't let adding a right bracket if there isn't a left bracket
        // Also you can't add a right bracket after an operator
        if(this.operatorStack.indexOf('(') === -1)
            throw new Error('There is no matching bracket for this bracket');
        if(this.isOperator(this.equation[this.equation.length - 1]))
            throw new Error('Equation will be invalid if brackets are closed here');
        if(this.equation[this.equation.length - 1] === '(')
            throw new Error('Not allowed to have an empty pair of brackets');

        this.addHolderToArray(this.outputStack);

        // Shunting Yard algorithm
        while(this.operatorStack[this.operatorStack.length - 1] !== '('){
            this.outputStack.push(this.operatorStack.pop());
        }
        this.operatorStack.pop();
        this.equation += ')';
        return this.equation;
    }

    // Simple helper function to determine if the value in the holder can be pushed onto the array
    addHolderToArray(toOutput){
        // Check that the holder is initialized, not empty, and isn't just an empty -
        if(this.holder && this.holder.length > 0 && !(this.holder.length === 1 && this.holder[0] === '-')){
            toOutput.push(Number(this.holder));
            this.holder = '';
        }        
    }

    reset(){
        this.holder = "";
        this.equation = "";
        this.operatorStack = [];
        this.outputStack = [];
        return this.equation;
    }

    calculate(){
        // We want to add whatever is in the holder to the output array before we begin calculating
        this.addHolderToArray(this.outputStack);

        //If the output array is empty, or only has 1 element then 
        if(this.outputStack.length === 0 || this.outputStack.length === 1){
            if(this.operatorStack.length > 0)
                throw new Error('Equation incomplete');

            if(this.outputStack.length === 1)
                this.equation = '' + this.outputStack.pop();
            else
                this.equation = '0';

            this.holder = this.equation;
            return this.equation;
        }

        // Simplified Shunting Yard algorithm
        try{
            while(this.operatorStack.length > 0)
                this.outputStack.push(this.operatorStack.pop());

            var resultStack = [];
            this.engine.reset();
            this.outputStack.forEach((val) => {
                if(Calc.isNumber(val)){
                    resultStack.push(val)
                } else {
                    var right = resultStack.pop();
                    
                    this.engine.add(resultStack.pop());
                    
                    switch(val){
                        case '*':
                            right = this.engine.multiply(right).equals();
                            break;
                        case '/':
                            right = this.engine.divide(right).equals();
                            break;
                        case '+':
                            right = this.engine.add(right).equals();
                            break;
                        case '-':
                            right = this.engine.subtract(right).equals();
                            break;
                        default:
                            throw new Error('Unrecognized operator used');
                    }

                    if(Calc.isNumber(right))
                        resultStack.push(right);
                    else
                        throw new Error('Invalid equation');
                }
            });

            // Just making sure everything is cleaned up
            this.outputStack = [];
            this.operatorStack = [];

            this.equation = '' + resultStack[0]
            this.holder = this.equation;

            return this.equation;
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    deleteSymbol(){
        var lastPos = this.equation.length - 1;
        var lastChar = this.equation[lastPos];

        if(this.holder === '-' || this.holder === '0'){
            this.holder = '';
            this.equation = this.equation.substr(0, lastPos);
            return this.equation;
        }

        if(this.equation[lastPos] === ')'){
            this.operatorStack.push('(');
            while(!Calc.isNumber(this.outputStack[this.outputStack.length - 1]))
                this.operatorStack.push(this.outputStack.pop());

            this.holder += this.outputStack.pop();
            this.equation = this.equation.substr(0, lastPos);
            return this.equation;
        }

        if(Calc.isNumber(lastChar) || lastChar === '.'){
            this.equation = this.equation.substr(0, lastPos);
        
            this.holder = this.holder.substr(0, this.holder.length - 1);
            return this.equation;
        }

        if(this.isOperator(lastChar) ||lastChar === '('){
            this.operatorStack.pop();
            this.holder += this.outputStack.pop();
            this.equation = this.equation.substr(0, lastPos);
            return this.equation;
        }  
        
        return this.equation;
    }
}