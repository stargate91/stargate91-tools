#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { parseArgs } from "node:util";

const optionsConfig = {
  type: {
    type: "string",
    short: "t",
    default: "backend",
  },
  pm: {
    type: "string",
  },
  stylelint: {
    type: "boolean",
    default: false,
  },
  "skip-install": {
    type: "boolean",
    default: false,
  },
  yes: {
    type: "boolean",
    short: "y",
    default: false,
  },
  help: {
    type: "boolean",
    short: "h",
    default: false,
  },
};

const VALID_TYPES = ["base", "backend", "frontend", "fullstack"];

function printHelp() {
  console.log(`
Usage: npx @stargate91/eslint-config [options]

Options:
  -t, --type <type>        Configuration type: base, backend, frontend, fullstack (default: backend)
  --stylelint              Also configure Stylelint with @stargate91/stylelint-config
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without installing packages
  -y, --yes                Skip interactive confirmations
  -h, --help               Show this help message

Examples:
  npx @stargate91/eslint-config --type frontend
  npx @stargate91/eslint-config --type frontend --stylelint
  npx @stargate91/eslint-config --type backend
  npx @stargate91/eslint-config --type fullstack
`);
}

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  return "npm";
}

function getInstallCommand(pm, withStylelint = false) {
  let pkgs = "@stargate91/eslint-config eslint typescript";
  if (withStylelint) {
    pkgs += " @stargate91/stylelint-config stylelint";
  }
  switch (pm) {
    case "pnpm":
      return `pnpm add -D ${pkgs}`;
    case "yarn":
      return `yarn add -D ${pkgs}`;
    case "bun":
      return `bun add -d ${pkgs}`;
    default:
      return `npm install --save-dev ${pkgs}`;
  }
}

function generateConfigFile(cwd, type) {
  const targetPath = path.join(cwd, "eslint.config.mjs");
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(cwd, "eslint.config.mjs.bak");
    fs.copyFileSync(targetPath, backupPath);
    console.log(`[stargate-eslint] Existing eslint.config.mjs backed up to eslint.config.mjs.bak`);
  }

  const hasMonorepo = fs.existsSync(path.join(cwd, "packages")) || fs.existsSync(path.join(cwd, "apps"));
  const projectGlob = hasMonorepo
    ? '["./packages/*/tsconfig.json", "./apps/*/tsconfig.json"]'
    : '["./tsconfig.json"]';

  let content = "";

  if (type === "base") {
    content = `import tseslint from "typescript-eslint";
import { createBaseConfig } from "@stargate91/eslint-config/base";

export default tseslint.config(
  // Global ignore patterns
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/*.d.ts",
    ],
  },

  // Shared Stargate91 base TypeScript rules (Strict TS, Security, Import-X)
  ...createBaseConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ${projectGlob},
  })
);
`;
  } else if (type === "frontend") {
    content = `import tseslint from "typescript-eslint";
import { createFrontendConfig } from "@stargate91/eslint-config/frontend";

export default tseslint.config(
  // Global ignore patterns
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/*.d.ts",
    ],
  },

  // Shared Stargate91 frontend rules (React, Hooks, A11y, Security, Import-X)
  ...createFrontendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ${projectGlob},
  })
);
`;
  } else if (type === "fullstack") {
    content = `import tseslint from "typescript-eslint";
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

  // Backend rules
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ${projectGlob},
    files: ["apps/api/**/*.ts", "apps/bot/**/*.ts", "packages/**/*.ts"],
  }),

  // Frontend rules
  ...createFrontendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ${projectGlob},
    files: ["apps/web/**/*.{ts,tsx}", "apps/desktop/src/renderer/**/*.{ts,tsx}"],
  })
);
`;
  } else {
    // Default backend
    content = `import tseslint from "typescript-eslint";
import { createBackendConfig } from "@stargate91/eslint-config/backend";

export default tseslint.config(
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

  // Shared Stargate91 backend rules
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ${projectGlob},
  })
);
`;
  }

  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`[stargate-eslint] Created eslint.config.mjs (${type} configuration)`);
}

function generateStylelintConfigFile(cwd) {
  const targetPath = path.join(cwd, ".stylelintrc.json");
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(cwd, ".stylelintrc.json.bak");
    fs.copyFileSync(targetPath, backupPath);
    console.log(`[stargate-eslint] Existing .stylelintrc.json backed up to .stylelintrc.json.bak`);
  }

  const content = JSON.stringify({ extends: "@stargate91/stylelint-config" }, null, 2) + "\n";
  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`[stargate-eslint] Created .stylelintrc.json (extending @stargate91/stylelint-config)`);
}

function updatePackageJson(cwd, withStylelint = false) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log(`[stargate-eslint] No package.json found in current directory, skipping script injection.`);
    return;
  }

  try {
    const raw = fs.readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(raw);

    if (!pkg.scripts) {
      pkg.scripts = {};
    }

    let modified = false;
    if (!pkg.scripts.lint) {
      pkg.scripts.lint = "eslint .";
      modified = true;
    }
    if (!pkg.scripts["lint:fix"]) {
      pkg.scripts["lint:fix"] = "eslint . --fix";
      modified = true;
    }

    if (withStylelint) {
      if (!pkg.scripts["lint:css"]) {
        pkg.scripts["lint:css"] = 'stylelint "src/**/*.css"';
        modified = true;
      }
      if (!pkg.scripts["lint:css:fix"]) {
        pkg.scripts["lint:css:fix"] = 'stylelint "src/**/*.css" --fix';
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
      console.log(`[stargate-eslint] Updated scripts in package.json (lint${withStylelint ? ', lint:css' : ''})`);
    } else {
      console.log(`[stargate-eslint] package.json scripts already configured.`);
    }
  } catch (err) {
    console.error(`[stargate-eslint] Warning: Could not update package.json: ${err.message}`);
  }
}

async function run() {
  const { values } = parseArgs({
    options: optionsConfig,
    strict: false,
    allowPositionals: true,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  const cwd = process.cwd();
  let configType = values.type || "backend";
  if (!VALID_TYPES.includes(configType)) {
    console.warn(`[stargate-eslint] Unknown configuration type "${configType}", defaulting to "backend".`);
    configType = "backend";
  }

  const withStylelint = values.stylelint === true;

  console.log(`[stargate-eslint] Initializing ${configType} ESLint configuration...`);
  if (withStylelint) {
    console.log(`[stargate-eslint] Stylelint integration enabled (--stylelint).`);
  }

  const pm = values.pm || detectPackageManager(cwd);
  console.log(`[stargate-eslint] Detected package manager: ${pm}`);

  generateConfigFile(cwd, configType);
  if (withStylelint) {
    generateStylelintConfigFile(cwd);
  }

  updatePackageJson(cwd, withStylelint);

  if (!values["skip-install"]) {
    const installCmd = getInstallCommand(pm, withStylelint);
    console.log(`[stargate-eslint] Running: ${installCmd}`);
    try {
      execSync(installCmd, { cwd, stdio: "inherit" });
      console.log("[stargate-eslint] Dependencies installed successfully.");
    } catch (err) {
      console.error(`[stargate-eslint] Failed to install dependencies: ${err.message}`);
      console.log(`[stargate-eslint] Please manually run: ${installCmd}`);
    }
  } else {
    console.log("[stargate-eslint] Skipping dependency installation (--skip-install).");
  }

  console.log("[stargate-eslint] Setup completed successfully.");
}

run().catch((err) => {
  console.error(`[stargate-eslint] Error: ${err.message}`);
  process.exit(1);
});
