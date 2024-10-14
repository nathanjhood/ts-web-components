import App = require('./App');

/**
 * The 'render' function.
 * Renders the passed-in component instance (attaches to the DOM).
 * Requires that your HTML document contains a tag with id set to "root".
 * Renders error and warning messages in case of failure.
 */
const render = <T extends HTMLElement>(element: () => T) => {
  const warnings: Error[] = [];
  const errors: Error[] = [];

  const root: HTMLElement | null = document.getElementById('root');

  if (root === null) {
    errors.push(new Error('Missing HTML tag with id="root"'));
  } else {
    if (element) {
      const el: T = element();
      root.appendChild<ReturnType<typeof element>>(el);
    }
  }

  // error reporting
  if (errors.length > 0 || warnings.length > 0) {
    const messages: Error[] = errors.concat(warnings);
    messages.forEach(async (message) => {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.innerText += message.stack + '\n';
      pre.appendChild(code);
      document.body.appendChild(pre);
      console.error(message.message);
      return message;
    });
  }
};

export = render(App);
