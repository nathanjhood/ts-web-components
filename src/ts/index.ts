import registry = require('./registry');

import AppComponent = require('./components/App/AppComponent');

const start = (): void => {
  registry.define('app-component', AppComponent);
  return;
}

export = start;
