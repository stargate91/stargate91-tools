import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import drizzlePlugin from "eslint-plugin-drizzle";
import nodePlugin from "eslint-plugin-n";
import importXPlugin from "eslint-plugin-import-x";

/**
 * Creates a battle-tested, ultra-strict backend ESLint Flat Configuration.
 *
 * @param {Object} [options]
 * @param {string} [options.tsconfigRootDir] - Root directory for resolving tsconfig paths
 * @param {string[]|boolean} [options.project=true] - Path(s) to tsconfig.json files
 * @param {string[]} [options.files] - Glob patterns for TypeScript files to lint
 * @param {Object} [options.drizzle] - Drizzle configuration overrides
 * @param {boolean} [options.drizzle.enabled=true] - Whether to enable Drizzle rules
 * @param {string[]} [options.drizzle.files] - Target files for Drizzle linting
 * @param {string[]} [options.drizzle.drizzleObjectName] - Object names representing the database client
 * @param {Object} [options.node] - Node.js safety rules configuration
 * @param {boolean} [options.node.enabled=true] - Whether to enable Node rules
 * @param {string[]} [options.node.files] - Target files for Node rules
 * @param {Object} [options.rules] - Additional custom rules to merge
 * @returns {import("typescript-eslint").ConfigArray}
 */
export function createBackendConfig(options = {}) {
  const {
    tsconfigRootDir,
    project = true,
    files = ["packages/*/src/**/*.ts", "apps/*/src/**/*.{ts,tsx}", "src/**/*.ts"],
    drizzle = {},
    node = {},
    rules = {},
  } = options;

  const drizzleEnabled = drizzle.enabled !== false;
  const drizzleFiles = drizzle.files || [
    "packages/db/src/**/*.ts",
    "packages/core/src/**/*.ts",
    "src/db/**/*.ts",
    "**/db/**/*.ts",
  ];
  const drizzleObjectName = drizzle.drizzleObjectName || ["db", "this.db"];

  const nodeEnabled = node.enabled !== false;
  const nodeFiles = node.files || ["packages/*/src/**/*.ts", "src/**/*.ts"];

  return tseslint.config(
    // Base JS Recommended
    eslint.configs.recommended,

    // TypeScript files with Type-Aware Linting
    {
      files,
      extends: [
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parserOptions: {
          project,
          tsconfigRootDir,
        },
      },
      plugins: {
        "import-x": importXPlugin,
      },
      rules: {
        // ─── ULTRA-STRICT TYPE SAFETY ───
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unsafe-member-access": "error",
        "@typescript-eslint/no-unsafe-call": "error",
        "@typescript-eslint/no-unsafe-return": "error",
        "@typescript-eslint/no-unsafe-argument": "error",
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/prefer-as-const": "error",

        // ─── ULTRA-STRICT ASYNC & PROMISE SAFETY ───
        "@typescript-eslint/return-await": ["error", "in-try-catch"],
        "@typescript-eslint/no-floating-promises": [
          "error",
          {
            ignoreVoid: true,
            checkThenables: true,
          },
        ],
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksVoidReturn: {
              arguments: true,
              attributes: false,
            },
          },
        ],
        "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",

        // ─── IMPORT INTEGRITY & CIRCULAR DEPENDENCY SAFETY ───
        "import-x/no-self-import": "error",
        "import-x/no-cycle": ["error", { maxDepth: 5 }],

        // ─── STRICT IMPORT / EXPORT ERGONOMICS ───
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
            fixStyle: "separate-type-imports",
            disallowTypeAnnotations: false,
          },
        ],
        "@typescript-eslint/consistent-type-exports": [
          "error",
          {
            fixMixedExportsWithInlineTypeSpecifier: false,
          },
        ],
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/method-signature-style": ["error", "property"],
        "@typescript-eslint/no-useless-empty-export": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-template-expression": "error",

        // ─── CLEAN CODE & STYLISTICS ───
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

        // ─── EXPLICIT API CONTRACTS & ENTERPRISE STRICTNESS ───
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowDirectConstAssertionInArrowFunctions: true,
          },
        ],
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/only-throw-error": "error",
        "@typescript-eslint/prefer-readonly": "error",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-loop-func": "error",
        "@typescript-eslint/strict-boolean-expressions": [
          "error",
          {
            allowString: false,
            allowNumber: false,
            allowNullableObject: false,
            allowNullableBoolean: false,
            allowNullableString: false,
            allowNullableNumber: false,
            allowAny: false,
          },
        ],

        // ─── CONTROL FLOW & SECURITY ───
        "no-console": "error",
        "no-debugger": "error",
        eqeqeq: ["error", "always"],
        "no-var": "error",
        "prefer-const": "error",
        curly: ["error", "all"],
        "default-case-last": "error",
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-new-func": "error",
        "no-caller": "error",
        "no-return-assign": ["error", "always"],
        "no-param-reassign": ["error", { props: false }],

        // Merged caller overrides
        ...rules,
      },
    },

    // Node.js process & event-loop safety block
    ...(nodeEnabled
      ? [
          {
            files: nodeFiles,
            plugins: {
              n: nodePlugin,
            },
            rules: {
              "n/no-process-exit": "error",
              "n/no-path-concat": "error",
              "n/no-sync": ["warn", { allowAtRootLevel: true }],
            },
          },
        ]
      : []),

    // Drizzle ORM data integrity safety block
    ...(drizzleEnabled
      ? [
          {
            files: drizzleFiles,
            plugins: {
              drizzle: drizzlePlugin,
            },
            rules: {
              "drizzle/enforce-delete-with-where": [
                "error",
                {
                  drizzleObjectName,
                },
              ],
              "drizzle/enforce-update-with-where": [
                "error",
                {
                  drizzleObjectName,
                },
              ],
            },
          },
        ]
      : [])
  );
}

export default createBackendConfig;
