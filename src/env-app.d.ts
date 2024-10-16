/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="node" />
/// <reference path="../lib/env-client.d.ts" />

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  /** **Experimental:** Import styles that can be used with `react-native-web` components, using the `style` prop. */
  export const unstable_styles: { readonly [key: string]: object };

  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  /** **Experimental:** Import styles that can be used with `react-native-web` components, using the `style` prop. */
  export const unstable_styles: { readonly [key: string]: object };

  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  /** **Experimental:** Import styles that can be used with `react-native-web` components, using the `style` prop. */
  export const unstable_styles: { readonly [key: string]: object };

  const classes: { readonly [key: string]: string };
  export default classes;
}

// Allow for css imports, but don't export anything
declare module '*.css';
// {
//   const styles: { [key: string]: string };
//   export default styles;
// }
declare module '*.sass';
declare module '*.scss';

declare module 'env' {
  const env: { readonly [key: string | 'symbol']: string }; // NodeJS.ProcessEnv
  export default env;
}
