# Typescript Web Components

Typed OOP in the browser!

```html
<!doctype html>
<html lang="en">
  <head>(...)</head>
  <body>
    <div id="root">
      <app-component>
        <slot>"Your App Goes Here!"</slot>
      </app-component>
    </div>
    <script type="module"></script>
  </body>
</html>
```

- No config
- No framework
- No abtractions

Just raw [Web API](https://developer.mozilla.org/en-US/docs/Web/API).

## How to...

### `serve ./public`

```sh
$ git clone git@github.com:nathanjhood/web-components.git
```

```sh
$ cd web-components
```

```sh
$ npm install
```

```sh
$ npm run start
# ...

Rebuilding...

   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3000      │
   │   - Network:  http://192.168.0.13:3000   │
   │                                          │
   │   Copied local address to clipboard!     │
   │                                          │
   └──────────────────────────────────────────┘
```

[Open in your browser](http://localhost:3000) and refresh the page after every change.

---

### `<projectFolder>/public`

```sh
./
├── index.html
└── static/
    ├── css/
    │   └── index.css
    ├── js/
    │   └── index.js
    └── png/
        └── logo.png

4 directories, 4 files
```

```sh
./index.html
./static/css/index.css
./static/js/index.js
./static/png/logo.png

4 directories, 4 files
```

---

### `class AppComponent {}`

```ts
// static/js/index.js

class AppComponent {}
```

---

### `AppComponent.constructor()`

```ts
class AppComponent {
  constructor() {/** setup goes here... */}
}
```

---

### `AppComponent extends HTMLElement`

```ts
// "I am a HTMLElement"

class AppComponent extends HTMLElement {
  constructor() {}
}

// "...plus more ;) "
```

---

### `HTMLElement.super()`

```ts
class AppComponent extends HTMLElement {
  constructor() {
    super(); // MUST do this first...
  }
}
```

---

### `this`

```ts
class AppComponent extends HTMLElement {
  constructor() {
    // inside here, "this" means "this 'AppComponent'"...

    super();
    this. // <-- '.' should produce a long list of props and methods...
  }
}
```

---

### `AppComponent.shadowRoot`

```ts
// "attachShadow()" comes from extending the HTMLElement class ;)

class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

```

---

### `AppComponent.shadowRoot.innerHtml`

```ts
// 'innerHTML' === <app-component>innerHTML</app-component>

class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<slot>Your app goes here</slot>`;
  }
}
```

### `CustomElementRegistry`

```ts
window.customElements.define('app-component', AppComponent);
```

---

### `'app-component': AppComponent`

```ts
window.customElements.define('app-component',
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<slot>Your app goes here</slot>`;
    }
  }
);
```

---

### `root.appendChild(ApplicationComponent)`

```ts
window.customElements.define('app-component',
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<slot>Your app goes here</slot>`;
	  document.getElementById("root")?.appendChild(this);
    }
  }
);
```

---

### `<app-component>`

```html
<!-- This is what you see in your IDE... -->
<!doctype html>
<html lang="en">
  <head></head>
  <body>
    <div id="root"></div>
    <script type="module" src="./static/js/index.js"></script>
  </body>
</html>
```

```html
<!-- ...this is what you see in your web browser! -->
<!doctype html>
<html lang="en">
  <head></head>
  <body>
    <div id="root">
      <app-component>
        #shadowRoot (open)
        <slot>"Your App Goes Here!"</slot>
      </app-component>
    </div>
    <script type="module"></script>
  </body>
</html>
```

---

### `AppComponent.render()`

```ts
class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = this.render();
	document.getElementById("root")?.appendChild(this);
  }
  render() {
    return `<slot>Your app goes here</slot>`;
  }
}
```

---

### `AppComponent.render(message)`

```ts
class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = this.render('Your app goes here');
	document.getElementById("root")?.appendChild(this);
  }
  render(message) {
    return `<slot>${message}</slot>`;
  }
}
```

---

### `AppComponent.setup()`

```ts
class AppComponent extends HTMLElement {
  constructor() {
    super();
	this.setup();
  }
  setup() {
	this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = this.render('Your app goes here');
	document.getElementById("root")?.appendChild(this);
  }
  render(message) {
    return `<slot>${message}</slot>`;
  }
}
```

---

_tip:_

```ts
// short
customElements.define()
```

or...

```ts
// fully-qualified
window.customElements.define()
```

---

_tip:_

```ts
class AppComponent extends HTMLElement {}

customElements.define('app-component', AppComponent);
```

or...

```ts
customElements.define('app-component',
  class AppComponent extends HTMLElement {}
);
```

---

## Further Reading

- [eienebergeffect @ Medium: Hello Web Components](https://eisenbergeffect.medium.com/hello-web-components-795ed1bd108e)
- [MDN's Web Component examples](https://github.com/mdn/web-components-examples)
- [MDN's Web API glossary](https://developer.mozilla.org/en-US/docs/Web/API)
- [MDN's Web API - HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
- [Building Interoperable Web Components (including React)](https://css-tricks.com/building-interoperable-web-components-react/)

[Read me on github.com](https://github.com/nathanjhood/web-components)

[Read me on nathanjhood.github.io](https://nathanjhood.github.io/web-components)
