# @stargate91/eslint-config

Enterprise-grade shared ESLint 9+ Flat Configurations for Stargate91 projects.

## Quick Start (CLI Installer)

### Backend Project:
```bash
npx @stargate91/eslint-config --type backend
```

### Frontend Project (React / Next.js / Vite):
```bash
npx @stargate91/eslint-config --type frontend
```

### Fullstack Monorepo:
```bash
npx @stargate91/eslint-config --type fullstack
```

### CLI Options

```bash
npx @stargate91/eslint-config --help

Options:
  -t, --type <type>        Configuration type: backend, frontend, fullstack (default: backend)
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without running package install
  -y, --yes                Accept defaults non-interactively
  -h, --help               Show help message
```

## Configurations

### 1. Frontend Configuration (`@stargate91/eslint-config/frontend`)
Combines the best practices from Nova, My-Website, and Swaya-Main:
- **Strict React & JSX Ergonomics (Nova):** Forbids inline `style` props, enforces `self-closing-comp`, `hook-use-state`, clean boolean values, and fragments.
- **React Compiler & Hooks (Swaya-Main):** React 19 rules (`react-hooks/immutability`, `set-state-in-effect`, `preserve-manual-memoization`, `refs`).
- **Accessibility / WCAG 2.1 (Nova & My-Website):** 11 mandatory `jsx-a11y` error checks.
- **Security Auditing (My-Website):** `eslint-plugin-security` ReDoS, eval, and timing attack checks.
- **Deterministic Import Architecture (My-Website):** `import-x/order` grouping and cycle detection.
- **Granular i18n Hygiene (Nova):** Comprehensive exclusion of layout props, icons, and styling utilities.

```javascript
import tseslint from "typescript-eslint";
import { createFrontendConfig } from "@stargate91/eslint-config/frontend";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/*.d.ts"] },
  ...createFrontendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.json"],
  })
);
```

### 2. Backend Configuration (`@stargate91/eslint-config/backend`)
- **Type-Aware TypeScript:** `strictTypeChecked` + `stylisticTypeChecked`.
- **Async & Promise Safety:** `return-await: in-try-catch`, `no-floating-promises`, `no-misused-promises`, `use-unknown-in-catch-callback-variable`.
- **Node.js Process & Event-Loop Protection:** `n/no-process-exit`, `n/no-path-concat`, `n/no-sync`.
- **Drizzle ORM Safety:** `drizzle/enforce-delete-with-where`, `drizzle/enforce-update-with-where`.
- **Import Architecture:** `import-x/no-cycle`, `import-x/no-self-import`.
