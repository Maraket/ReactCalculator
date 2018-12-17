import React, { Component } from 'react'
import './App.scss';
import Calculator from './calculator/calculator.component';
import { CssBaseline } from '@material-ui/core';

class App extends Component {
  render() {
    return (
      <div className="container">
        <CssBaseline />
        <Calculator></Calculator>
      </div>
    );
  }
}

export default App;
