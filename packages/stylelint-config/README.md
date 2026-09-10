# @stargate91/stylelint-config

Enterprise-grade shareable Stylelint configuration with strict **Design Tokens**, automatic **Recess Property Ordering**, and **CSS Specificity Hygiene**.

[![npm version](https://img.shields.io/npm/v/@stargate91/stylelint-config.svg)](https://www.npmjs.com/package/@stargate91/stylelint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Stylelint](https://img.shields.io/badge/Stylelint-%3E%3D16.0.0-263238.svg)](https://stylelint.io)

---

## Features

- **Strict Design Token Enforcement**:
  - Forbids raw hex colors (`#ffffff`) and `rgb/rgba` in colors, backgrounds, borders, and shadows (forces CSS variables / design tokens).
  - Forbids raw `px` units in `padding`, `margin`, `gap`, `border-radius`, and `font-size` (exempts borders).
  - Forbids raw numbers in `font-weight` and `z-index` (forces typography and layer tokens).
  - Forbids raw millisecond timing and generic easing in `transition` and `animation` (forces motion tokens).
  - **100% Forbidden `!important` and `inherit`**: Bans `!important` across declarations and `@keyframes`, and prohibits `inherit` on standard properties.
- **Deterministic Property Ordering (Recess Order)**:
  - Powered by `stylelint-config-recess-order`.
  - Running `stylelint --fix` automatically formats all CSS declarations in standard order: *Positioning → Box Model → Typography → Visual → Animation/Misc*.
- **Selector & Specificity Hygiene (Nova & My-Website)**:
  - `selector-max-id: 0` (No ID selectors).
  - `selector-max-universal: 0` (No universal `*` selectors).
  - `selector-max-compound-selectors: 3` (Stops deep selector nesting).
  - `selector-no-qualifying-type: true` (Forbids `div.card` and `button.btn`).
  - `max-nesting-depth: 3`.
- **Modern CSS Standards**:
  - `color-function-notation: modern`.
  - `media-feature-range-notation: context` (modern `@media (width >= 768px)` syntax).
  - `selector-pseudo-element-colon-notation: double` (`::before`, `::after`).
  - `no-unknown-animations: true` (flags typos in `@keyframes` names).
  - Vendor prefix exceptions for modern gradient text (`background-clip: text` & `-webkit-text-fill-color: transparent`).
- **Built-in Token Exemptions**:
  - Automatically exempts token definition files (`**/tokens/**/*.css`, `**/variables.css`, `**/themes/**/*.css`) so raw token values can be authored without lint errors.

---

## Quick Start (CLI Installer)

Initialize Stylelint in your project with one command:

```bash
npx @stargate91/stylelint-config
```

### CLI Flags

```text
Usage: stargate-stylelint [options]

Options:
  --pm <manager>           Package manager: npm, pnpm, yarn, bun (default: auto-detect)
  --skip-install           Generate config and scripts without running package install
  -y, --yes                Accept defaults non-interactively
  -h, --help               Show help message
```

---

## Manual Installation

1. Install the package and Stylelint:

```bash
npm install -D @stargate91/stylelint-config stylelint
```

2. Create a `.stylelintrc.json` in your project root:

```json
{
  "extends": "@stargate91/stylelint-config"
}
```

3. Add scripts to `package.json`:

```json
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.css\"",
    "lint:css:fix": "stylelint \"src/**/*.css\" --fix"
  }
}
```

---

## Custom Overrides

To extend or adjust rules in your project:

```json
{
  "extends": "@stargate91/stylelint-config",
  "rules": {
    "selector-max-compound-selectors": 4
  }
}
```

---

## License

MIT License © 2026 stargate91
