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
- No abstractions

Just raw [Web API](https://developer.mozilla.org/en-US/docs/Web/API).

Powered by Typescript, TailwindCSS, ESBuild, and fast-refreshing development server!

## How to...

Step by step!

- [`start`](#start)
- [`class AppComponent {}`](#class-appcomponent-)
- [`AppComponent.constructor()`](#appcomponentconstructor)
- [`AppComponent extends HTMLElement`](#appcomponent-extends-htmlelement)
- [`HTMLElement.super()`](#htmlelementsuper)
- [`this`](#this)
- [`AppComponent.innerHtml`](#appcomponentinnerhtml)
- [`CustomElementRegistry`](#customelementregistry)
- [`'app-component': AppComponent`](#app-component-appcomponent)
- [`AppComponent.render()`](#appcomponentrender)
- [`AppComponent.render(innerHTML)`](#appcomponentrenderinnerhtml)
- [`AppComponent.setup()`](#appcomponentsetup)
- [`createElement('app-component')`](#createelementapp-component)
- [`App()`](#app)
- [`render(App)`](#renderapp)
- [`<app-component>`](#app-component)
- [Tips](#tips)
- [Further Reading](#further-reading)

### `start`

```sh
$ git clone git@github.com:nathanjhood/ts-web-components.git
```

```sh
$ cd ts-web-components
```

```sh
$ npm install
```

```sh
# For Windows...
$env:NODE_ENV="development"

# For Linux/Mac...
export NODE_ENV="development"
```

```sh
$ npm run start
```
```sh
# ...

Rebuilding...

Done in 1623ms.

Server running at http://127.0.0.1:3000/
To exit: Ctrl + c

```

[Open in your browser](http://localhost:3000) and edit `src/App.ts` - the page will automatically refresh itself after every save.

---

### `class AppComponent {}`

```ts
// src/App.ts

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

### `AppComponent.innerHtml`

```ts
// 'innerHTML' === <app-component>innerHTML</app-component>

class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<slot>Your app goes here</slot>`;
  }
}
```

### `CustomElementRegistry`

```ts
// IMPORTANT
window.customElements.define('app-component', AppComponent);
```

---

### `'app-component': AppComponent`

```ts
window.customElements.define('app-component', // <-- wrap the class!
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `<slot>Your app goes here</slot>`;
    }
  }
); // <-- '.define()' ends here!
```

---

---

### `AppComponent.render()`

```ts
window.customElements.define('app-component',
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = this.render();
    }
    render() {
      return `<slot>Your app goes here</slot>`;
    }
  }
);
```

---

### `AppComponent.render(innerHTML)`

```ts
window.customElements.define('app-component',
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = this.render('Your app goes here');
    }
    render(innerHTML: string): string {
      return `<slot>${innerHTML}</slot>`;
    }
  }
);
```

---

### `AppComponent.setup()`

```ts
window.customElements.define('app-component',
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.setup();
    }
    setup(): void {
      this.innerHTML = this.render('Your app goes here');
    }
    render(innerHTML: string): string {
      return `<slot>${innerHTML}</slot>`;
    }
  }
);
```

---

### `createElement('app-component')`

```ts
window.customElements.define('app-component',
  class AppComponent extends HTMLElement {
    constructor() {
      super();
      this.setup();
    }
    setup(): void {
      this.innerHTML = this.render('Your app goes here');
    }
    render(innerHTML: string): string {
      return `<slot>${innerHTML}</slot>`;
    }
  }
);

const app = document.createElement('app-component');
```

---

### `App()`

```ts
const App = () => {
  // define the component
  window.customElements.define('app-component',
    class AppComponent extends HTMLElement {
      constructor() {
        super();
        this.setup();
      }
      setup(): void {
        this.innerHTML = this.render('Your app goes here');
      }
      render(innerHTML: string): string {
        return `<slot>${innerHTML}</slot>`;
      }
    }
  );
  // then return it
  return document.createElement('app-component');
}

// Now we can assign it :)
const app = App();
```

---

### `render(App)`

```ts
// src/index.ts

import App = require('./App');

const render = (element: () => HTMLElement) = {
  // ...attaches passed-in element to document
}

// so, pass it our App :)
render(App)

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

## Tips

---

### functional approach

```ts
// example:

const Button = (): HTMLButtonElement => {
  return document.createElement('button')
}

// HTMLButtonElement
const button = Button();

```

---

### factory method

```ts
// example

const CustomButton = () => {
  class CustomButtonElement extends HTMLButtonElement {
    constructor() {
      super();
    }
  }
  customElements.define('custom-button', CustomButtonElement)
  return document.createElement('custom-button') as CustomButtonElement;
};

// CustomButtom
const customButton = CustomButton();
```

---

### passing props

```ts
type CustomButtonProps = {
  type: 'submit' | 'reset' | 'button';
};

const CustomButton = (props: CustomButtonProps) => {
  class CustomButtonElement extends HTMLButtonElement {
    constructor() {
      super();
      this.type = props.type;
    }
  }
  customElements.define('custom-button', CustomButtonElement);
  return document.createElement('custom-button') as CustomButtonElement;
};

const customButton = CustomButton({ type: 'submit' });

```

---

### adding children

```ts
type CustomButtonProps = {
  type: 'submit' | 'reset' | 'button';
  children?: Node;
};

const CustomButton = (props: CustomButtonProps) => {
  class CustomButtonElement extends HTMLButtonElement {
    constructor() {
      super();
      this.type = props.type;
      if (props.children) this.appendChild(props.children);
    }
  }
  customElements.define('custom-button', CustomButtonElement);
  return document.createElement('custom-button') as CustomButtonElement;
};

const customButtonA = CustomButton({ type: 'submit' });
const customButtonB = CustomButton({ type: 'submit', children: customButtonA });

```

---

### adding styles

```ts
type CustomButtonProps = {
  type: 'submit' | 'reset' | 'button';
  children?: Node;
  className?: string;
};

const CustomButton = (props: CustomButtonProps) => {
  class CustomButtonElement extends HTMLButtonElement {
    constructor() {
      super();
      this.type = props.type;
      if (props.children) this.appendChild(props.children);
      if (props.className) this.className = props.className;
    }
  }
  customElements.define('custom-button', CustomButtonElement);
  return document.createElement('custom-button') as CustomButtonElement;
};

const tailwindButton = CustomButton({
  type: 'submit',
  className: 'flex align-left text-white bg-red-500',
});

```

---

## Further Reading

- [webcomponents.org](https://www.webcomponents.org/)
- [eisenebergeffect @ Medium: Hello Web Components](https://eisenbergeffect.medium.com/hello-web-components-795ed1bd108e)
- [MDN's Web Component examples](https://github.com/mdn/web-components-examples)
- [MDN's Web API glossary](https://developer.mozilla.org/en-US/docs/Web/API)
- [MDN's Web API - HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
- [Building Interoperable Web Components (including React)](https://css-tricks.com/building-interoperable-web-components-react/)

[Read me on github.com](https://github.com/nathanjhood/ts-web-components)

[Read me on nathanjhood.github.io](https://nathanjhood.github.io/ts-web-components)
