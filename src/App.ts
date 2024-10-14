import AppComponent from './lib/AppComponent';

const App = () => {
  console.log('constructing App()');
  return document.createElement('app-component') as AppComponent;
};

export = App;
