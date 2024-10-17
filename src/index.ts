import env = require('env');
import './index.css';
import App = require('./App');

/**
 * The 'render' function.
 * Renders the passed-in component instance (attaches to the DOM).
 * Requires that your HTML document contains a tag with id set to "root".
 * Renders error and warning messages in case of failure.
 */
const render = <T extends HTMLElement = HTMLElement>(element: () => T) => {
  // prepare to collect any errors and warnings
  const warnings: Error[] = [];
  const errors: Error[] = [];

  // get a reference to the HTML element with `id="root"`
  const root: HTMLElement | null = document.getElementById('root');

  if (root === null) {
    errors.push(new Error('Missing HTML tag with id="root"'));
  } else {
    // create a shadow root and attach it to the 'root' element...
    const shadowRoot: ShadowRoot = root.attachShadow({ mode: 'open' });
    // for CSS stylesheets to work, create a link pointing at the CSS...
    const extStylesheet: HTMLLinkElement =
      document.createElement<'link'>('link');
    extStylesheet.setAttribute('rel', 'stylesheet');
    extStylesheet.setAttribute(
      'href',
      `${env['PUBLIC_URL']}static/css/index.css`
    );
    // include Tailwind, if you're using it...
    const twStylesheet = document.createElement('link');
    twStylesheet.setAttribute('rel', 'stylesheet');
    twStylesheet.setAttribute(
      'href',
      `${env['PUBLIC_URL']}static/css/tailwind.css`
    );
    // Attach the created elements to the shadow dom
    shadowRoot.appendChild<HTMLLinkElement>(extStylesheet);
    shadowRoot.appendChild<HTMLLinkElement>(twStylesheet);
    shadowRoot.appendChild<T>(element());
  }

  // error reporting
  if (errors.length > 0 || warnings.length > 0) {
    // put all errors and warnings (if any) into one array
    const messages: Error[] = errors.concat(warnings);
    //
    messages.forEach((message) => {
      // attach each message to the document
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.innerText += message.stack + '\n';
      pre.appendChild(code);
      document.body.appendChild(pre);
      // also log the message to the console
      console.error(message.message);
      return message;
    });
  }
};

export = render<HTMLElement>(App);
