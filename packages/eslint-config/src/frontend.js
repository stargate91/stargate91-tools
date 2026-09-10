import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import securityPlugin from "eslint-plugin-security";
import importXPlugin from "eslint-plugin-import-x";
import i18nextPlugin from "eslint-plugin-i18next";

/**
 * Creates an ultra-strict, enterprise-grade React & TypeScript frontend ESLint Flat Configuration.
 * Combines:
 *  - Nova: Strict React & JSX ergonomics, forbidden inline styles, WCAG 2.1 accessibility, granular i18n
 *  - My-Website: Security vulnerability auditing, deterministic import ordering (import-x), core TS hygiene
 *  - Swaya-Main: React Compiler (React 19 / Forget) rules and optional translation key validation
 *
 * @param {Object} [options]
 * @param {string} [options.tsconfigRootDir] - Root directory for resolving tsconfig paths
 * @param {string[]|boolean} [options.project] - Path(s) to tsconfig.json files for type-aware linting
 * @param {string[]} [options.files] - Glob patterns for frontend files to lint
 * @param {Object} [options.react] - React-specific configuration overrides
 * @param {boolean} [options.react.allowInlineStyles=false] - If true, permits inline style attributes
 * @param {Object} [options.security] - Security plugin overrides
 * @param {boolean} [options.security.enabled=true] - Whether to enable security auditing
 * @param {Object} [options.imports] - Import ordering & cycle overrides
 * @param {boolean} [options.imports.enabled=true] - Whether to enable import-x rules
 * @param {Object} [options.i18n] - i18n plugin overrides
 * @param {boolean} [options.i18n.enabled=true] - Whether to enable i18n text checks
 * @param {Object} [options.rules] - Custom user rules to merge/override
 * @returns {import("typescript-eslint").ConfigArray}
 */
export function createFrontendConfig(options = {}) {
  const {
    tsconfigRootDir,
    project,
    files = ["**/*.{ts,tsx}"],
    react = {},
    security = {},
    imports = {},
    i18n = {},
    rules = {},
  } = options;

  const allowInlineStyles = react.allowInlineStyles === true;
  const securityEnabled = security.enabled !== false;
  const importsEnabled = imports.enabled !== false;
  const i18nEnabled = i18n.enabled !== false;

  const languageOptions = {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ...(project !== undefined ? { project, tsconfigRootDir } : {}),
    },
  };

  return tseslint.config(
    // Base JS recommended
    js.configs.recommended,

    // TypeScript recommended
    ...tseslint.configs.recommended,

    // Frontend TypeScript / TSX rules
    {
      files,
      languageOptions,
      settings: {
        react: {
          version: "detect",
        },
      },
      plugins: {
        react: reactPlugin,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
        "jsx-a11y": jsxA11y,
        ...(securityEnabled ? { security: securityPlugin } : {}),
        ...(importsEnabled ? { "import-x": importXPlugin } : {}),
        ...(i18nEnabled ? { i18next: i18nextPlugin } : {}),
      },
      rules: {
        // ─── TYPESCRIPT & CORE LOGIC HYGIENE ───
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
            fixStyle: "separate-type-imports",
          },
        ],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        eqeqeq: ["error", "always"],
        "prefer-const": "error",
        "no-var": "error",
        curly: ["error", "all"],
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-debugger": "error",
        "no-alert": "error",
        "no-eval": "error",
        "no-implied-eval": "error",
        "prefer-template": "error",
        "object-shorthand": ["error", "always"],
        "no-unneeded-ternary": "error",
        "no-lonely-if": "error",
        "prefer-arrow-callback": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",

        // ─── STRICT REACT & JSX ERGONOMICS (NOVA) ───
        ...(allowInlineStyles
          ? {}
          : {
              "react/forbid-dom-props": ["error", { forbid: ["style"] }],
              "react/forbid-component-props": ["error", { forbid: ["style"] }],
            }),
        "react/self-closing-comp": "error",
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-curly-brace-presence": [
          "error",
          { props: "never", children: "never" },
        ],
        "react/jsx-fragments": ["error", "syntax"],
        "react/hook-use-state": "error",
        "react/no-array-index-key": "warn",
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],

        // ─── REACT HOOKS & REACT COMPILER (SWAYA-MAIN) ───
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        ...(reactHooks.rules && reactHooks.rules["immutability"]
          ? {
              "react-hooks/immutability": "warn",
              "react-hooks/set-state-in-effect": "warn",
              "react-hooks/preserve-manual-memoization": "warn",
              "react-hooks/refs": "warn",
            }
          : {}),

        // ─── ACCESSIBILITY / WCAG 2.1 (NOVA + MY-WEBSITE) ───
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-proptypes": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/aria-unsupported-elements": "error",
        "jsx-a11y/heading-has-content": "error",
        "jsx-a11y/html-has-lang": "error",
        "jsx-a11y/iframe-has-title": "error",
        "jsx-a11y/img-redundant-alt": "warn",
        "jsx-a11y/role-has-required-aria-props": "error",
        "jsx-a11y/role-supports-aria-props": "error",
        "jsx-a11y/tabindex-no-positive": "error",
        "jsx-a11y/no-static-element-interactions": "warn",

        // ─── SECURITY & VULNERABILITY AUDITING (MY-WEBSITE) ───
        ...(securityEnabled
          ? {
              "security/detect-unsafe-regex": "error",
              "security/detect-eval-with-expression": "error",
              "security/detect-buffer-noassert": "error",
              "security/detect-possible-timing-attacks": "warn",
              "security/detect-non-literal-regexp": "warn",
            }
          : {}),

        // ─── DETERMINISTIC IMPORT ARCHITECTURE (MY-WEBSITE) ───
        ...(importsEnabled
          ? {
              "import-x/no-duplicates": "error",
              "import-x/no-self-import": "error",
              "import-x/no-cycle": ["error", { maxDepth: 5 }],
              "import-x/order": [
                "error",
                {
                  groups: [
                    "builtin",
                    "external",
                    "internal",
                    ["parent", "sibling", "index"],
                    "object",
                    "type",
                  ],
                  "newlines-between": "ignore",
                  alphabetize: { order: "ignore" },
                },
              ],
            }
          : {}),

        // ─── LOCALIZATION & i18n HYGIENE (NOVA) ───
        ...(i18nEnabled
          ? {
              "i18next/no-literal-string": [
                "warn",
                {
                  mode: "jsx-only",
                  "jsx-attributes": {
                    include: [
                      "placeholder",
                      "title",
                      "label",
                      "description",
                      "subtitle",
                      "emptyMessage",
                      "confirmText",
                      "cancelText",
                      "hint",
                      "featureName",
                      "searchPlaceholder",
                    ],
                    exclude: [
                      "className",
                      "id",
                      "to",
                      "href",
                      "variant",
                      "size",
                      "color",
                      "weight",
                      "align",
                      "justify",
                      "gap",
                      "as",
                      "role",
                      "type",
                      "name",
                      "key",
                      "ref",
                      "src",
                      "alt",
                      "maxWidth",
                      "minItemWidth",
                      "glow",
                      "padding",
                      "position",
                      "value",
                      "target",
                      "rel",
                      "dot",
                      "pulse",
                      "fullWidth",
                      "interactive",
                      "bordered",
                      "aria-label",
                      "aria-labelledby",
                      "aria-describedby",
                      "aria-hidden",
                      "defaultValue",
                      "status",
                      "placement",
                      "shape",
                      "orientation",
                      "activeTab",
                      "defaultTab",
                      "icon",
                      "avatarUrl",
                      "thumbnail",
                      "channelName",
                      "botName",
                      "author",
                      "footer",
                    ],
                  },
                  callees: {
                    exclude: [
                      "t",
                      "useTranslation",
                      "classNames",
                      "clsx",
                      "cva",
                      "navigate",
                      "open",
                      "window.open",
                      "setLocale",
                      "match",
                      "includes",
                      "indexOf",
                      "startsWith",
                      "endsWith",
                    ],
                  },
                  words: {
                    exclude: [
                      "[0-9]+",
                      "[•|/\\-:\\%\\...\\×\\#\\@\\$\\&]+",
                      "^[A-Z0-9_-]+$",
                    ],
                  },
                },
              ],
            }
          : {}),

        // Caller overrides
        ...rules,
      },
    }
  );
}

export default createFrontendConfig;
