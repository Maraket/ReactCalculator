import ShuntingYard from './shunting.yard';

describe('Shunting Yard Object Test', () => {
    it('Should allow be defined', () => expect(new ShuntingYard()).toBeDefined());

    let sy = null;

    beforeEach(() => sy = new ShuntingYard());

    it('If 2 decimal places can be put in the same number', () => {
        sy.addSymbol('.');

        expect(() => sy.addSymbol('.')).toThrow('Cannot have 2 Decimal points in the same number');
    });


    test('Testing against known value', () => {
        sy.addSymbol(3);
        sy.addSymbol('+');
        sy.addSymbol(4);
        sy.addSymbol('*');
        sy.addSymbol(2);
        sy.addSymbol('/');
        sy.addSymbol('(');
        sy.addSymbol(1);
        sy.addSymbol('-');
        sy.addSymbol(5);
        sy.addSymbol(')');

        expect(sy.outputStack).toEqual([3,4,2,'*',1,5,'-']);
        expect(sy.operatorStack).toEqual(['+','/']);
        expect(sy.calculate()).toBe('1');
    });

    test('bad symbol handing', () => {
        expect(()=>sy.addSymbol('{')).toThrow('Unrecognized symbol');
        expect(()=>sy.addSymbol('^')).toThrow('Unrecognized symbol');
        expect(()=>sy.addSymbol(Number.NaN)).toThrow('Unrecognized symbol');
        expect(()=>sy.addSymbol(Number.POSITIVE_INFINITY)).toThrow('Unrecognized symbol');
    });

    it('should result is a negative number', () => {
        sy.addSymbol('-');
        sy.addSymbol(50);
        expect(sy.calculate()).toBe('-50');
    });

    it('should return 0', () => expect(sy.calculate()).toBe('0'));

});