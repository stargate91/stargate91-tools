# Stargate91 Tools

Shared developer tooling, configurations, packages, and engineering primitives for Stargate91 applications and repositories.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![ESLint](https://img.shields.io/badge/ESLint-9.x%20Flat%20Config-4B32C3.svg)](https://eslint.org)
[![Stylelint](https://img.shields.io/badge/Stylelint-%3E%3D16.0.0-263238.svg)](https://stylelint.io)

---

## Packages

| Package | Version | Description |
| :--- | :--- | :--- |
| [`@stargate91/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@stargate91/eslint-config.svg)](https://www.npmjs.com/package/@stargate91/eslint-config) | Enterprise-grade ESLint 9+ Flat Configurations (Base, Backend, Frontend, Fullstack) |
| [`@stargate91/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@stargate91/stylelint-config.svg)](https://www.npmjs.com/package/@stargate91/stylelint-config) | Enterprise-grade Stylelint Configuration with Design Tokens, Recess Order, and Specificity hygiene |

---

## Repository Architecture

This repository is managed as an **npm workspace** monorepo:

```text
stargate91-tools/
├── packages/
│   ├── eslint-config/         # @stargate91/eslint-config shared ESLint configuration
│   │   ├── bin/
│   │   │   └── cli.js         # Automated CLI installer (stargate-eslint)
│   │   ├── src/
│   │   │   ├── base.js        # Pure TypeScript / Library profile
│   │   │   ├── backend.js     # Node.js + Drizzle ORM + Async safety profile
│   │   │   ├── frontend.js    # React 19 + Strict JSX + A11y + Security profile
│   │   │   └── index.js       # Central barrel export
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── stylelint-config/      # @stargate91/stylelint-config shared Stylelint configuration
│       ├── bin/
│       │   └── cli.js         # Automated CLI installer (stargate-stylelint)
│       ├── index.js           # Unified Stylelint configuration
│       ├── package.json
│       └── README.md
├── package.json               # Root workspace configuration
└── README.md
```

---

## Development Setup

### Prerequisites
- **Node.js**: `>= 18.0.0` (Recommended: `20.x` or `22.x`)
- **npm**: `>= 9.0.0`

### Installation
Clone the repository and install dependencies across all workspaces:

```bash
git clone git@github.com:stargate91/stargate91-tools.git
cd stargate91-tools
npm install
```

---

## License

MIT License © 2026 stargate91
