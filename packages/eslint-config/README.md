# @stargate91/eslint-config

Enterprise-grade shared ESLint 9+ Flat Configurations for Stargate91 projects.

## Usage

In your project's `eslint.config.mjs`:

```javascript
import { createBackendConfig } from "@stargate91/eslint-config/backend";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Global ignore patterns
  {
    ignores: [
      "**/dist/**",
      "**/dist-electron/**",
      "**/node_modules/**",
      "**/*.log",
      "**/drizzle/**",
      "**/*.d.ts",
    ],
  },

  // Shared Backend Rules
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./packages/*/tsconfig.json", "./apps/*/tsconfig.json"],
  })
);
```
