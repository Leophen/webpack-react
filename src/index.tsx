import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import webpackImg from './assets/webpack.png'

import Text from './components/Text'

const App = () => {
  return <>
    <div className="container">
      welcome to webpack react project.
      <Text/>
      <img src={webpackImg} alt="webpack" />
    </div>
  </>;
};

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept(function () {
    console.log('Accepting the updated printMe module!')
  })
}