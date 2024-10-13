class AppComponent extends HTMLElement {
  /**
   *
   */
  static get observedAttributes(): string[] {
    return ['disable'];
  }
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
      shadowRoot.innerHTML = this.render();
    }
  }
  /**
   *
   * @returns
   */
  private render(): string {
    return `<slot></slot>`;
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
    console.log('Custom square element added to page.');
    // updateStyle(this);
  }

  disconnectedCallback(): void {
    console.log('<app-component> removed from page.');
  }

  adoptedCallback(): void {
    console.log('<app-component> moved to new page.');
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    console.log('<app-component> attributes changed.');
    // updateStyle(this);
  }
}

export = AppComponent;
