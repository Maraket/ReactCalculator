import Calc from './calc';



describe('CalcObject', () => {
    var calc = null;
    beforeAll(() => {
        calc = new Calc();
    });
    it('should be defined', () => {
        expect(calc).toBeDefined();
    });

    it('initial state', () => {
        expect(calc.equals()).toBe(0);
    })
    
    test('various simple calculations to test', () => {
        expect(calc.add(5).equals()).toBe(5);
        expect(calc.subtract(5).equals()).toBe(-5);
        expect(calc.add(5).multiply(3).equals()).toBe(15);
        expect(calc.add(5).divide(5).equals()).toBe(1);
    });

    test('reset functionality', () => {
        expect(calc.add(5).multiply(3).reset().equals()).toBe(0);
        expect(calc.add(-1).reset().equals()).toBe(0);
        expect(calc.subtract(-1).reset().equals()).toBe(0);
    });

    test('error testing', () => {
        expect(() => calc.add().equals()).toThrow('Value provided is not a number');
        expect(() => calc.subtract('abcd').add('magic bad')).toThrow('Value provided is not a number');
        expect(() => calc.divide('0')).toThrow('Cannot Divide by Zero');
        expect(() => calc.multiply('0av')).toThrow('Value provided is not a number');

        // Still works
        expect(calc.add(5).subtract(3).equals()).toBe(2);

        expect(() => calc.add(2).add(10).divide(0).equals()).toThrow("Cannot Divide by Zero");
        expect(calc.equals()).toBe(12);
    });
});
