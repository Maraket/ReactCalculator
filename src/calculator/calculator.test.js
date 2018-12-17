import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from './calculator.component';

describe('Calculator Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Calculator />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});