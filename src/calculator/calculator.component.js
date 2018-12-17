import React, { Component } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import Backspace from '@material-ui/icons/Backspace';
import * as _ from 'lodash';
import './calculator.scss';
import ShuntingYard from './shunting.yard';

const symbols_set = [(<Backspace className={'backspace'}/>),'=','+','-','/','*','(',')'];

/*
    This calculator component is a single component and single file due to the simplicity
    of the requirements. If this had functions like sin cos, and the layout
    was expected to be changed to address things like history, this would probably be
    broken up.

    The way calculations are done is using the Shunting Yard algorithm used by alot of 
    calculators.

    Basic reasoning is that it means that the overall sanity of the equation, and state
    can be monitored constantly for "invalid" actions, as well as simplify validation and sanity.

    For layout I relied on Material UI for the styling, just to reduce development time
*/
class Calculator extends Component {
    engine = null;

    constructor(props){
        super(props);

        props.engine? this.engine = props.engine : this.engine = new ShuntingYard();

        this.state = {
            output: ""
        };

        // Programatically generate symbols and numbers
        this.layout = {
            numbers: _.chain(Array(10))
                .map((val, idx) => 
                    {
                        const num = (idx + 1) % 10;
                        return {
                            content: num,
                            fn: () => this.addSymbol(num)
                        }
                    }
                ).chunk(3)
                .value(),
            symbols: _.chain(symbols_set).map((val) => {
                return {
                    content: val,
                    fn: () => this.addSymbol(val)
                }
            }).value()
        };

        // Add decimal place and clear
        this.layout.numbers[3].push({
            content: '.',
            fn: () => this.addSymbol('.')
        }, {
            content: 'C',
            fn: () => this.reset()
        });

        // Change the behaviour of the backspace and = button 
        // Note I could have just kept it going to the switch method
        // and added a case, but this mainly seemed neater
        this.layout.symbols[0].fn = () => this.delete();
        this.layout.symbols[1].fn = () => this.result();
    }

    addSymbol(sym){
        try{
            this.setState({
                warning: false,
                error: false,
                output: this.engine.addSymbol(sym)
            });
        } catch(e){
            this.setState({
                warning: e.message
            });
        }
    }
    result(){
        try{
            this.setState({
                warning: false,
                error: false,
                output: this.engine.calculate()
            });
        }catch(e){
            this.engine.reset()
            this.setState({
                error: e.message,
                output: 'Error'
            });
        }
    }

    // Reset all variables
    reset(){
        this.setState({
            warning: false,
            error: false,
            output: this.engine.reset()
        });
    }
    
    delete(){
        this.setState({
            warning: false,
            error: false,
            output: this.engine.deleteSymbol()
        });
    }


    render() {
        const numbers = this.layout.numbers;
        const symbols = this.layout.symbols;

        const errored = this.state.error? {className:'error', error:true, helperText: this.state.error}: {};
        const warning = this.state.warning? {className:'warning', helperText: this.state.warning}: {};

        return (
            <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            spacing={8}>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    variant="outlined"
                    value={this.state.output}
                    {...errored}
                    {...warning}
                    >
                    </TextField>
                </Grid>
                <Grid
                container
                item
                direction="row"
                spacing={8}>
                    <Grid 
                    container 
                    direction="column" 
                    alignItems="stretch" 
                    item 
                    sm={8} xs={12}>
                    {
                        numbers.map((row, idx) => {
                            return (
                                <Grid
                                item 
                                key={`row${idx}`}>
                                {
                                    row.map((btn, btnidx) => {
                                        return (
                                            <Button color="primary" variant="contained" className={"calcButton"} onClick={btn.fn} key={`btn${btnidx}`}>
                                                <span>{btn.content}</span>
                                            </Button>
                                        );
                                    })
                                }
                                </Grid>
                            )
                        })
                    }
                    </Grid>
                    <Grid item sm={4} xs={12}>
                    {
                        symbols.map((btn, idx) => {
                            return (
                                <Button color="primary" variant="contained" className={"symbolButton"} onClick={btn.fn} key={`btn${idx}`}>
                                    <span>{btn.content}</span>
                                </Button>
                            )
                        })
                    }
                    </Grid>
                </Grid>
        </Grid>
        );
    }
}

export default Calculator;
