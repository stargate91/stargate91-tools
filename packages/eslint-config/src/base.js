import js from "@eslint/js";
import tseslint from "typescript-eslint";
import securityPlugin from "eslint-plugin-security";
import importXPlugin from "eslint-plugin-import-x";

/**
 * Creates an ultra-strict, enterprise-grade base TypeScript ESLint Flat Configuration.
 * Suitable for pure TypeScript libraries, shared packages, utilities, and data models.
 *
 * @param {Object} [options]
 * @param {string} [options.tsconfigRootDir] - Root directory for resolving tsconfig paths
 * @param {string[]|boolean} [options.project=true] - Path(s) to tsconfig.json files for type-aware linting
 * @param {string[]} [options.files] - Glob patterns for TypeScript files to lint
 * @param {Object} [options.security] - Security plugin overrides
 * @param {boolean} [options.security.enabled=true] - Whether to enable security auditing
 * @param {Object} [options.imports] - Import ordering & cycle overrides
 * @param {boolean} [options.imports.enabled=true] - Whether to enable import-x rules
 * @param {Object} [options.rules] - Custom user rules to merge/override
 * @returns {import("typescript-eslint").ConfigArray}
 */
export function createBaseConfig(options = {}) {
  const {
    tsconfigRootDir,
    project = true,
    files = ["**/*.ts"],
    security = {},
    imports = {},
    rules = {},
  } = options;

  const securityEnabled = security.enabled !== false;
  const importsEnabled = imports.enabled !== false;

  return tseslint.config(
    // 1. ESLint recommended base rules
    js.configs.recommended,

    // 2. TypeScript strict & stylistic type-checked suites
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    // 3. Main TypeScript rules & project options
    {
      files,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          projectService: project === true,
          project: project !== true ? project : undefined,
          tsconfigRootDir,
        },
      },
      plugins: {
        "@typescript-eslint": tseslint.plugin,
      },
      rules: {
        // High-ROI TypeScript hygiene
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "inline-type-imports" },
        ],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksVoidReturn: {
              arguments: false,
              attributes: false,
            },
          },
        ],
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/return-await": ["error", "in-try-catch"],
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",

        // Core hygiene & consistency
        curly: ["error", "all"],
        eqeqeq: ["error", "always", { null: "ignore" }],
        "prefer-template": "error",
        "object-shorthand": ["error", "always"],
        "no-unneeded-ternary": "error",
        "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      },
    },

    // 4. Security auditing
    ...(securityEnabled
      ? [
          {
            files,
            plugins: {
              security: securityPlugin,
            },
            rules: {
              "security/detect-unsafe-regex": "error",
              "security/detect-eval-with-expression": "error",
              "security/detect-buffer-noassert": "error",
              "security/detect-new-buffer": "error",
              "security/detect-possible-timing-attacks": "warn",
              ...(security.rules || {}),
            },
          },
        ]
      : []),

    // 5. Deterministic imports and circular dependency checks
    ...(importsEnabled
      ? [
          {
            files,
            plugins: {
              "import-x": importXPlugin,
            },
            rules: {
              "import-x/first": "error",
              "import-x/no-duplicates": ["error", { "prefer-inline": true }],
              "import-x/no-self-import": "error",
              "import-x/no-cycle": ["error", { maxDepth: 10, ignoreExternal: true }],
              "import-x/order": [
                "error",
                {
                  groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                    "type",
                  ],
                  "newlines-between": "always",
                  alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                  },
                },
              ],
              ...(imports.rules || {}),
            },
          },
        ]
      : []),

    // 6. User overrides
    ...(Object.keys(rules).length > 0
      ? [
          {
            files,
            rules,
          },
        ]
      : [])
  );
}

export default createBaseConfig();
