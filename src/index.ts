// import { createRequire } from 'node:module';
// const require: NodeRequire = createRequire(__filename);
// import env from 'env';

/**
 *
 */
class AppComponent extends HTMLElement {
  /**
   *
   */
  static get observedAttributes(): string[] {
    return ['disable'];
  }
  /**
   * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
   *
   * @internal
   */
  public elementInternals: ElementInternals = this.attachInternals();
  /**
   *
   */
  constructor() {
    super();
    this.setup();
  }
  /**
   *
   */
  private setup(): void {
    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
    if (!shadowRoot) {
      throw new Error('Failed to attach a shadowRoot to new App Component()');
    } else {
      shadowRoot.innerHTML = this.render(
        `<pre><code>${3.14159 * 1}</code></pre>`
      );
    }
  }
  /**
   *
   * @returns
   */
  private render(innerHtml: string): string {
    return `<slot><p>${innerHtml}</p></slot>`;
  }
  /**
   *
   */
  get disable(): string | null {
    return this.getAttribute('disable');
  }
  /**
   *
   */
  set disable(value: string | null) {
    if (value) {
      this.setAttribute('disable', value);
    }
  }
  /**
   *
   */
  connectedCallback(): void {
    console.debug('<app-component> element added to page.');
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
    console.log('<app-component> attributes changed.', {
      name: name,
      oldValue: oldValue,
      newValue: newValue,
    });
  }
}

export = AppComponent;

if (!customElements.get('app-component')) {
  window.customElements.define('app-component', AppComponent);
}

document.getElementById('root')?.appendChild(new AppComponent());

// function App() {
//   return document.createElement('app-component');
// }
