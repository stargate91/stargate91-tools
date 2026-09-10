# @stargate91/eslint-config

Enterprise-grade shared ESLint 9+ Flat Configurations for Stargate91 projects. Fully type-aware, zero-compromise rulesets designed for pure TypeScript packages, robust backend services, and modern React 19 frontend applications.

[![npm version](https://img.shields.io/npm/v/@stargate91/eslint-config.svg)](https://www.npmjs.com/package/@stargate91/eslint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![ESLint](https://img.shields.io/badge/ESLint-9.x%20Flat%20Config-4B32C3.svg)](https://eslint.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-%3E%3D5.0.0-3178C6.svg)](https://www.typescriptlang.org/)

---

## Features

- **ESLint 9 Flat Config Native**: Modern `eslint.config.mjs` without legacy `.eslintrc` debt.
- **Automated CLI Installer**: Run a single `npx` command to initialize configs, scripts, and dependencies.
- **Stylelint Integration**: Add `--stylelint` to automatically install and configure `@stargate91/stylelint-config` simultaneously.
- **3 Specialized Profiles**:
  - `/base`: Pure TypeScript libraries, utilities, models, and shared packages.
  - `/backend`: Node.js process protection, Drizzle ORM query guards, strict async/promise safety.
  - `/frontend`: React 19 Compiler rules, strict JSX ergonomics, zero inline styles, 11 WCAG 2.1 A11y rules, ReDoS security audit, and granular i18n filtering.
- **Import Determinism**: Consistent `import-x` order grouping, self-import prevention, and circular dependency checks.
- **Strict TypeScript**: Type-aware `strictTypeChecked` and `stylisticTypeChecked` suites out of the box.

---

## Quick Start (CLI Installer)

Initialize your configuration in one non-interactive command:

### 1. Frontend Application (with Stylelint integration):
```bash
npx @stargate91/eslint-config --type frontend --stylelint
```

### 2. Frontend Application (ESLint only):
```bash
npx @stargate91/eslint-config --type frontend
```

### 3. Pure TypeScript Library / Shared Package:
```bash
npx @stargate91/eslint-config --type base
```

### 4. Backend Service (Node.js, Drizzle ORM, APIs, Bots):
```bash
npx @stargate91/eslint-config --type backend
```

### 5. Fullstack Monorepo Root:
```bash
npx @stargate91/eslint-config --type fullstack --stylelint
```

### CLI Flags

```text
Usage: stargate-eslint [options]

Options:
  -t, --type <type>        Configuration type: base, backend, frontend, fullstack (default: backend)
  --stylelint              Also configure Stylelint with @stargate91/stylelint-config
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without running package install
  -y, --yes                Accept defaults non-interactively
  -h, --help               Show help message
```

---

## Manual Installation

If you prefer manual setup or are integrating into an existing workspace:

```bash
npm install -D @stargate91/eslint-config eslint typescript-eslint
```

---

## Configuration Profiles

### 1. Base Configuration (`@stargate91/eslint-config/base`)

Tailored for pure TypeScript packages, shared models, utility libraries, and modules without React or Node runtime dependencies.

```javascript
// eslint.config.mjs
import tseslint from "typescript-eslint";
import { createBaseConfig } from "@stargate91/eslint-config/base";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/*.d.ts",
    ],
  },
  ...createBaseConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.json"],
  })
);
```

---

### 2. Frontend Configuration (`@stargate91/eslint-config/frontend`)

Synthesized from the battle-tested rulesets of **Nova**, **My-Website**, and **Swaya-Main**:

```javascript
// eslint.config.mjs
import tseslint from "typescript-eslint";
import { createFrontendConfig } from "@stargate91/eslint-config/frontend";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/*.d.ts",
    ],
  },
  ...createFrontendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.json"],
  })
);
```

**Key Rules:**
- **Zero Inline Styles (Nova)**: `react/forbid-dom-props: style` and `react/forbid-component-props: style` enforce utility CSS systems.
- **Strict JSX Ergonomics (Nova)**: `react/self-closing-comp`, `react/hook-use-state` (`[val, setVal]` naming), `react/jsx-boolean-value: never`, `react/jsx-curly-brace-presence`.
- **React 19 Compiler Preparation (Swaya-Main)**: `react-hooks/immutability`, `set-state-in-effect`, `preserve-manual-memoization`, `refs`.
- **Accessibility / WCAG 2.1 (Nova & My-Website)**: 11 mandatory `jsx-a11y` error checks (`alt-text`, `anchor-is-valid`, `aria-role`, `tabindex-no-positive`, etc.).
- **Granular i18n Hygiene (Nova)**: `eslint-plugin-i18next` with comprehensive layout and token exclusions (`className`, `variant`, `size`, `gap`, `icon`, `clsx`, `cva`).

---

### 3. Backend Configuration (`@stargate91/eslint-config/backend`)

Optimized for Node.js backend servers, microservices, Discord/Telegram bots, and database layers:

```javascript
// eslint.config.mjs
import tseslint from "typescript-eslint";
import { createBackendConfig } from "@stargate91/eslint-config/backend";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/dist-electron/**",
      "**/node_modules/**",
      "**/drizzle/**",
      "**/*.d.ts",
    ],
  },
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: true,
    drizzle: { enabled: true },
  })
);
```

---

### 4. Fullstack Monorepo Configuration

For fullstack repositories where backend and frontend packages coexist in a single ESLint configuration:

```javascript
// eslint.config.mjs
import tseslint from "typescript-eslint";
import { createBackendConfig } from "@stargate91/eslint-config/backend";
import { createFrontendConfig } from "@stargate91/eslint-config/frontend";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/drizzle/**",
      "**/*.d.ts",
    ],
  },

  // Backend services (Node.js, Drizzle, API, Bots)
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./apps/api/tsconfig.json", "./apps/bot/tsconfig.json"],
    files: ["apps/api/**/*.ts", "apps/bot/**/*.ts", "packages/backend/**/*.ts"],
  }),

  // Frontend applications (React, Vite, Next.js)
  ...createFrontendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./apps/web/tsconfig.json"],
    files: ["apps/web/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
  })
);
```

---

## Configuration Options API

All config factory functions accept an options object:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tsconfigRootDir` | `string` | `process.cwd()` | Root directory for resolving tsconfig paths |
| `project` | `boolean \| string[]` | `true` | Path(s) to `tsconfig.json` files for type-aware linting |
| `files` | `string[]` | *Profile dependent* | Target glob patterns |
| `rules` | `Record<string, any>` | `{}` | Custom user rule overrides |
| `security.enabled` | `boolean` | `true` | Toggle security plugin auditing |
| `imports.enabled` | `boolean` | `true` | Toggle import ordering & cycle checks |
| `drizzle.enabled` *(backend)* | `boolean` | `true` | Toggle Drizzle ORM safety rules |
| `node.enabled` *(backend)* | `boolean` | `true` | Toggle Node.js process & event-loop safety rules |
| `react.allowInlineStyles` *(frontend)* | `boolean` | `false` | If `true`, permits inline `style` attributes |
| `i18n.enabled` *(frontend)* | `boolean` | `true` | Toggle literal string checks for internationalization |

---

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:css": "stylelint \"src/**/*.css\"",
    "lint:css:fix": "stylelint \"src/**/*.css\" --fix"
  }
}
```

---

## License

MIT License © 2026 stargate91
