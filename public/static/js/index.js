class AppComponent extends HTMLElement {
  /**
   *
   */
  static get observedAttributes() {
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
   * @returns {void}
   * @private
   */
  setup() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    if (!shadowRoot) {
      throw new Error('Failed to attach a shadowRoot to new App Component()');
    } else {
      shadowRoot.innerHTML = this.render();
    }
  }
  /**
   *
   * @returns {string}
   * @private
   */
  render() {
    return `<slot></slot>`;
  }
  /**
   *
   */
  get disable() {
    return this.getAttribute('disable');
  }
  /**
   *
   */
  set disable(value) {
    if (value) {
      this.setAttribute('disable', value);
    }
  }
  /**
   * @returns {void}
   * @private
   */
  connectedCallback() {
    console.log('Custom square element added to page.');
    // updateStyle(this);
  }
  /**
   * @returns {void}
   * @private
   */
  disconnectedCallback() {
    console.log('<app-component> removed from page.');
  }
  /**
   * @returns {void}
   * @private
   */
  adoptedCallback() {
    console.log('<app-component> moved to new page.');
  }
  /**
   * @returns {void}
   * @private
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('<app-component> attributes changed.');
    // updateStyle(this);
  }
}

export default AppComponent;
