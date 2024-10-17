import './App.css';
import logo = require('./logo.svg');

const App = (): HTMLElement => {
  //
  console.log('constructing App()');
  //
  const logoSrc = 'data:image/svg+xml;base64,' + logo;
  //
  if (window.customElements.get('app-component') === undefined) {
    window.customElements.define(
      'app-component',
      /**
       * The `AppComponent` class.
       * @extends {HTMLElement}
       */
      class AppComponent extends HTMLElement {
        /**
         * Constructs a new instance of this component.
         */
        constructor() {
          super();
          console.debug('constructor()');
        }
        /**
         * Performs the required setup steps for this component instance.
         *
         * @returns {void}
         * @private
         */
        private setup(): void {
          this.innerHTML = this.render();
          console.debug('setup()');
        }
        /**
         * Fires whenever this component instance is connected to a page.
         * Inherited from {@link HTMLElement}.
         *
         * @returns {void}
         */
        connectedCallback(): void {
          this.setup();
          console.debug(
            '<app-component connectedCallback()> - element added to page.'
          );
        }
        /**
         * Fires whenever this component instance is disconnected from a page.
         * Inherited from {@link HTMLElement}.
         *
         * @returns {void}
         */
        disconnectedCallback(): void {
          console.debug(
            '<app-component disconnectedCallback()> - element removed from page.'
          );
        }
        /**
         * Fires whenever this component instance in moved to a new page.
         * Inherited from {@link HTMLElement}.
         *
         * @returns {void}
         */
        adoptedCallback(): void {
          console.debug(
            '<app-component adoptedCallback()> - element moved to new page.'
          );
        }
        /**
         * Fires whenever this components' attributes have changed.
         * Inherited from {@link HTMLElement}.
         *
         * @param {string} name
         * @param {string} oldValue
         * @param {string} newValue
         * @returns {void}
         */
        attributeChangedCallback(
          name: string,
          oldValue: string,
          newValue: string
        ): void {
          console.debug(
            '<app-component attributeChangedCallback()> attributes changed:',
            {
              name: name,
              oldValue: oldValue,
              newValue: newValue,
            }
          );
        }
        /**
         * Renders this component instance to a string.
         * @returns {string}
         */
        private render(): string {
          return `
<div class="App">
  <header class="App-header">
  <img
    src="${logoSrc}"
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
  return document.createElement('app-component') satisfies HTMLElement;
};

export = App;
