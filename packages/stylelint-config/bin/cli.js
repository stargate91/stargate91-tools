#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function printHelp() {
  console.log(`
Usage: stargate-stylelint [options]

Enterprise-grade Stylelint Configuration Installer by Stargate91.

Options:
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without running package install
  -y, --yes                Accept defaults non-interactively
  -h, --help               Show this help message

Examples:
  npx @stargate91/stylelint-config
  npx @stargate91/stylelint-config --skip-install
`);
}

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  return "npm";
}

function getInstallCommand(pm) {
  const deps = "@stargate91/stylelint-config stylelint";
  switch (pm) {
    case "pnpm":
      return `pnpm add -D ${deps}`;
    case "yarn":
      return `yarn add -D ${deps}`;
    case "bun":
      return `bun add -d ${deps}`;
    default:
      return `npm install --save-dev ${deps}`;
  }
}

function generateConfigFile(cwd) {
  const targetPath = path.join(cwd, ".stylelintrc.json");
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(cwd, ".stylelintrc.json.bak");
    fs.copyFileSync(targetPath, backupPath);
    console.log(`[stargate-stylelint] Existing .stylelintrc.json backed up to .stylelintrc.json.bak`);
  }

  const content = JSON.stringify(
    {
      extends: "@stargate91/stylelint-config"
    },
    null,
    2
  ) + "\n";

  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`[stargate-stylelint] Created .stylelintrc.json`);
}

function updatePackageJson(cwd) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log(`[stargate-stylelint] Warning: No package.json found in current directory.`);
    return;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.scripts = pkg.scripts || {};

    let modified = false;
    if (!pkg.scripts["lint:css"]) {
      pkg.scripts["lint:css"] = 'stylelint "src/**/*.css"';
      modified = true;
    }
    if (!pkg.scripts["lint:css:fix"]) {
      pkg.scripts["lint:css:fix"] = 'stylelint "src/**/*.css" --fix';
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
      console.log(`[stargate-stylelint] Added lint:css and lint:css:fix scripts to package.json`);
    } else {
      console.log(`[stargate-stylelint] package.json scripts already configured.`);
    }
  } catch (err) {
    console.error(`[stargate-stylelint] Error updating package.json:`, err.message);
  }
}

async function run() {
  const args = process.argv.slice(2);
  const cwd = process.cwd();

  if (args.includes("-h") || args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const skipInstall = args.includes("--skip-install");

  let pm = "";
  const pmIdx = args.indexOf("--pm");
  if (pmIdx !== -1 && args[pmIdx + 1]) {
    pm = args[pmIdx + 1];
  } else {
    pm = detectPackageManager(cwd);
  }

  console.log(`[stargate-stylelint] Initializing Stylelint configuration...`);
  console.log(`[stargate-stylelint] Detected package manager: ${pm}`);

  generateConfigFile(cwd);
  updatePackageJson(cwd);

  if (!skipInstall) {
    const cmd = getInstallCommand(pm);
    console.log(`[stargate-stylelint] Installing dependencies: ${cmd}`);
    try {
      execSync(cmd, { cwd, stdio: "inherit" });
      console.log(`[stargate-stylelint] Dependencies installed successfully.`);
    } catch (err) {
      console.error(`[stargate-stylelint] Error installing dependencies:`, err.message);
      process.exit(1);
    }
  } else {
    console.log(`[stargate-stylelint] Skipping dependency installation (--skip-install).`);
  }

  console.log(`[stargate-stylelint] Setup completed successfully.`);
}

run();
