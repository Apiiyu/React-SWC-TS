/// <reference types="vite/client" />

/**
 * @description vite-plugin-svg-icons ships client.d.ts declaring this, but
 * its package.json `exports` map doesn't expose a `./client` subpath, so
 * `/// <reference types="vite-plugin-svg-icons/client" />` can't resolve
 * under `moduleResolution: bundler`. Declared here instead.
 */
declare module "virtual:svg-icons-register" {
  const component: never;
  export default component;
}
