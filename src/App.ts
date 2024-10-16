import env from 'env';
import './App.css';
import logo = require('./logo.svg');

const App = (): HTMLElement => {
  //
  const logoSrc = 'data:image/svg+xml;base64,' + logo;
  //
  if (!window.customElements.get('app-component')) {
    console.log('constructing App()');
    window.customElements.define(
      'app-component',
      /**
       * The `AppComponent` class.
       * @extends {HTMLElement}
       */
      class AppComponent extends HTMLElement {
        /**
         *
         */
        constructor() {
          super();
          console.debug('constructor()');
        }
        /**
         *
         */
        private setup(): void {
          const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
          shadowRoot.innerHTML = this.render();
          // Append external stylesheet to the shadow dom
          const linkElem: HTMLLinkElement =
            document.createElement<'link'>('link');
          linkElem.setAttribute('rel', 'stylesheet');
          linkElem.setAttribute(
            'href',
            `${env['PUBLIC_URL']}static/css/index.css`
          );
          // Attach the created elements to the shadow dom
          shadowRoot.appendChild<HTMLLinkElement>(linkElem);
          console.debug('setup()');
        }
        /**
         *
         */
        connectedCallback(): void {
          this.setup();
          console.debug(
            '<app-component connectedCallback()> - element added to page.'
          );
        }

        disconnectedCallback(): void {
          console.debug(
            '<app-component disconnectedCallback()> - element removed from page.'
          );
        }

        adoptedCallback(): void {
          console.debug(
            '<app-component adoptedCallback()> - element moved to new page.'
          );
        }

        attributeChangedCallback(
          name: string,
          oldValue: string,
          newValue: string
        ): void {
          console.debug(
            '<app-component attributeChangedCallback()> attributes changed.',
            {
              name: name,
              oldValue: oldValue,
              newValue: newValue,
            }
          );
        }
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
  return document.createElement('app-component');
};

export = App;
