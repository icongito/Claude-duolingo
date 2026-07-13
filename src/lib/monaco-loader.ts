import { loader } from "@monaco-editor/react";

/**
 * Points @monaco-editor/react at the self-hosted copy under public/ instead
 * of its jsdelivr CDN default — the editor must load on networks that block
 * third-party CDNs. Side-effect only; import for its effect before any
 * MonacoEditor instance mounts. See scripts/copy-monaco.mjs.
 */
loader.config({ paths: { vs: "/monaco-editor/vs" } });
