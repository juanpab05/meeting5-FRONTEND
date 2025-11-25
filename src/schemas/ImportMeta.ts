/// <reference types="vite/client" />

/**
 * Environment variables read from Vite's `import.meta.env`.
 *
 * Keep this interface in sync with the environment variables your app
 * expects to receive (for example via `.env` files or the hosting platform).
 */
interface ImportMetaEnv {
  /** Base URL of the API used by the frontend (e.g. https://api.example.com). */
  readonly VITE_API_URL: string;
}

/**
 * Vite's `ImportMeta` extension containing `env`.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
