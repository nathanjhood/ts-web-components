function define(name: string, constructor: CustomElementConstructor): void;
function define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void {
  if(!window.customElements.get(name)) {
    window.customElements.define(name, constructor, options ?? undefined);
  }
}

export = define;
