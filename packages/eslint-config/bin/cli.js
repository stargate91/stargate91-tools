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

function printHelp() {
  console.log(`
Usage: npx @stargate91/eslint-config [options]

Options:
  -t, --type <type>        Configuration type: backend (default: backend)
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without installing packages
  -y, --yes                Skip interactive confirmations
  -h, --help               Show this help message
`);
}

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  return "npm";
}

function getInstallCommand(pm) {
  const pkgs = "@stargate91/eslint-config eslint typescript";
  switch (pm) {
    case "pnpm":
      return `pnpm add -D ${pkgs}`;
    case "yarn":
      return `yarn add -D ${pkgs}`;
    case "bun":
      return `bun add -d ${pkgs}`;
    default:
      return `npm install -D ${pkgs}`;
  }
}

function generateBackendConfigFile(cwd) {
  const targetPath = path.join(cwd, "eslint.config.mjs");
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(cwd, "eslint.config.mjs.bak");
    fs.copyFileSync(targetPath, backupPath);
    console.log(`[stargate-eslint] Existing eslint.config.mjs backed up to eslint.config.mjs.bak`);
  }

  // Check if project has monorepo tsconfigs or single root tsconfig
  const hasMonorepo = fs.existsSync(path.join(cwd, "packages")) || fs.existsSync(path.join(cwd, "apps"));
  const projectGlob = hasMonorepo
    ? '["./packages/*/tsconfig.json", "./apps/*/tsconfig.json"]'
    : '["./tsconfig.json"]';

  const content = `import tseslint from "typescript-eslint";
import { createBackendConfig } from "@stargate91/eslint-config/backend";

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

  // Shared Stargate91 backend rules
  ...createBackendConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ${projectGlob},
  })
);
`;

  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`[stargate-eslint] Created eslint.config.mjs`);
}

function updatePackageJson(cwd) {
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

    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
      console.log(`[stargate-eslint] Added "lint" and "lint:fix" scripts to package.json`);
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
  console.log("[stargate-eslint] Initializing ESLint configuration...");

  const pm = values.pm || detectPackageManager(cwd);
  console.log(`[stargate-eslint] Detected package manager: ${pm}`);

  generateBackendConfigFile(cwd);
  updatePackageJson(cwd);

  if (!values["skip-install"]) {
    const installCmd = getInstallCommand(pm);
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
