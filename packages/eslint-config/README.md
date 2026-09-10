# @stargate91/eslint-config

Enterprise-grade shared ESLint 9+ Flat Configurations for Stargate91 projects.

## Quick Start (CLI Installer)

Run the automated installer in any project:

```bash
npx @stargate91/eslint-config
```

The installer automatically:
1. Detects your package manager (`npm`, `pnpm`, `yarn`, `bun`).
2. Installs `@stargate91/eslint-config`, `eslint`, and `typescript`.
3. Creates `eslint.config.mjs` with type-aware backend settings.
4. Adds `lint` and `lint:fix` scripts to `package.json`.

### CLI Options

```bash
npx @stargate91/eslint-config --help

Options:
  -t, --type <type>        Configuration type: backend (default: backend)
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without running package install
  -y, --yes                Accept defaults non-interactively
  -h, --help               Show help message
```

## Manual Setup

Install dependencies:

```bash
npm install -D @stargate91/eslint-config eslint typescript
```

Add `eslint.config.mjs` to your project root:

```javascript
import tseslint from "typescript-eslint";
import { createBackendConfig } from "@stargate91/eslint-config/backend";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.d.ts",
    ],
  },
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.json"],
  })
);
```
