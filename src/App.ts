import './App.css';
import logo = require('./logo.svg');

import env from 'env';

const App = () => {
  //
  if (!window.customElements.get('app-component')) {
    console.log('constructing App()');
    window.customElements.define(
      'app-component',
      /**
       * The `AppComponent` class.
       */
      class AppComponent extends HTMLElement {
        /**
         *
         */
        constructor() {
          super();
          console.debug('constructor()');
          this.setup();
        }
        /**
         *
         */
        private setup() {
          console.debug('setup()');
          const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
          if (shadowRoot) {
            shadowRoot.innerHTML = this.render();
          }
        }
        connectedCallback(): void {
          console.debug('<app-component> element added to page.');
          const shadowRoot = this.shadowRoot;
          if (!shadowRoot) {
            throw new Error('No shadowRoot to attach external stylesheet to!');
          } else {
            // Apply external styles to the shadow dom
            const linkElem = document.createElement('link');
            linkElem.setAttribute('rel', 'stylesheet');
            linkElem.setAttribute(
              'href',
              `${env['PUBLIC_URL']}/static/css/index.css`
            );
            // Attach the created elements to the shadow dom
            shadowRoot.appendChild(linkElem);
          }
        }

        disconnectedCallback(): void {
          console.debug('<app-component> removed from page.');
        }

        adoptedCallback(): void {
          console.debug('<app-component> moved to new page.');
        }

        attributeChangedCallback(
          name: string,
          oldValue: string,
          newValue: string
        ): void {
          console.debug('<app-component> attributes changed.', {
            name: name,
            oldValue: oldValue,
            newValue: newValue,
          });
        }
        private render(): string {
          return `
<div class="App">
  <header class="App-header">
  <img
    src="data:image/svg+xml;base64,${logo}"
    class="App-logo"
    alt="logo"
  />
  <p>
    Edit <code>src/App.ts</code> and save to reload.
  </p>
  <a
    class="App-link"
    href="https://github.com/nathanjhood/ts-web-components"
    target="_blank"
    rel="noopener noreferrer"
  >
    Powered by ts-web-components
  </a>
  </header>
</div>
          `;
        }
      }
    );
  }
  return document.createElement('app-component');
};

export = App;
