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
   * Specify the property on the element instance type
   */
  public props: {
    // types
    foo?: string;
  } = {
    // defaults
  };
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
    console.log('constructor()');
    this.setup();
  }
  /**
   *
   */
  private setup(): void {
    console.log('setup()');

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
    if (!shadowRoot) {
      throw new Error('Failed to attach a shadowRoot to new App Component()');
    }
    this.props = { foo: 'Your application goes here!' };
    shadowRoot.innerHTML = this.render(
      `<pre><code>${this.props.foo || 'foo was undefined'}</code></pre>`
    );
  }
  /**
   *
   * @returns
   */
  private render(innerHtml: string): string {
    return `<slot>${innerHtml}</slot>`;
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
if (!window.customElements.get('app-component')) {
  window.customElements.define('app-component', AppComponent);
}
export = AppComponent;
