class Calc {
    constructor(value = 0){
        if(!Calc.isNumber(value))
            throw new Error('Value provided is not a number');
        this.value = value;
    }

    static isNumber(val){
        return !Number.isNaN(Number(val).valueOf()) && Number.isFinite(Number(val).valueOf());
    }

    add(val){
        if(!Calc.isNumber(val))
            throw new Error('Value provided is not a number');
        this.value += Number(val);
        return this;
    }

    subtract(val){
        if(!Calc.isNumber(val))
            throw new Error('Value provided is not a number');
        this.value -= Number(val);
        return this;
    }
    
    multiply(val){
        if(!Calc.isNumber(val))
            throw new Error('Value provided is not a number');
        this.value *= Number(val);
        return this;
    }

    divide(val){
        if(!Calc.isNumber(val))
            throw new Error('Value provided is not a number');

        if(0 === Number(val))
            throw new Error("Cannot Divide by Zero");
        this.value /= Number(val);
        return this;
    }

    equals(){
        var output = this.value;
        this.reset();
        return output;
    }

    reset(){
        this.value = 0;
        return this;
    }
}

export default Calc;