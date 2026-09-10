export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order"
  ],
  rules: {
    // 1. Strict !important and inherit prevention
    "declaration-no-important": true,
    "keyframe-declaration-no-important": true,

    // 2. Ultra-strict Design Token Enforcement (Swaya-Main & Nova)
    "declaration-property-value-disallowed-list": {
      // Forbid inherit and !important on all standard properties
      "/^(?!--)/": [
        "inherit",
        "!important",
        "/!important/"
      ],
      // Forbid raw hex and rgba in colors/backgrounds/borders/shadows
      "/^(?!--).*(?:color|background|border|outline|box-shadow|text-shadow)/": [
        "/#[0-9a-fA-F]{3,8}/",
        "/rgba?\\(/"
      ],
      // Forbid raw px in spacing (padding, margin, gap)
      "/^(?!--).*(?:padding|margin|gap)/": ["/\\d+px/"],
      // Forbid raw px in border radius
      "/^(?!--).*(?:border-radius)/": ["/\\d+px/"],
      // Forbid raw px in font size
      "/^(?!--).*(?:font-size)/": ["/\\d+px/"],
      // Forbid raw numbers in font weight (must use design tokens)
      "/^(?!--).*(?:font-weight)/": ["/^[0-9]+$/"],
      // Forbid raw numbers in z-index (must use layer tokens)
      "/^(?!--).*(?:z-index)/": ["/^-?[0-9]+$/"],
      // Forbid raw timing and easing in transitions and animations (must use motion tokens)
      "/^(?!--).*(?:transition|animation)/": [
        "/\\b\\d+(?:\\.\\d+)?m?s\\b/",
        "/cubic-bezier/",
        "/(?<![\\w-])(?:ease|ease-in|ease-out|ease-in-out|linear)(?![\\w-])/"
      ]
    },

    // 3. Disallowed Units and Functions
    "color-named": "never",
    "color-no-hex": true,
    "function-disallowed-list": ["rgb", "rgba"],
    "unit-disallowed-list": [
      ["px", "pt", "in", "cm", "mm", "pc"],
      {
        ignoreProperties: {
          px: [
            "border",
            "border-width",
            "border-top",
            "border-right",
            "border-bottom",
            "border-left",
            "border-top-width",
            "border-right-width",
            "border-bottom-width",
            "border-left-width",
            "outline-width",
            "box-shadow"
          ]
        }
      }
    ],

    // 4. Specificity & Selector Hygiene (Nova & My-Website)
    "selector-max-id": 0,
    "selector-max-universal": 0,
    "selector-max-compound-selectors": 3,
    "max-nesting-depth": 3,
    "selector-no-qualifying-type": true,
    "no-descending-specificity": true,
    "no-duplicate-selectors": true,

    // 5. Modern CSS Standards & Formatting
    "length-zero-no-unit": true,
    "number-max-precision": 4,
    "color-function-notation": "modern",
    "media-feature-range-notation": "context",
    "selector-pseudo-element-colon-notation": "double",
    "selector-attribute-quotes": "always",
    "value-keyword-case": "lower",
    "no-unknown-animations": true,
    "block-no-empty": true,
    "no-empty-source": true,
    "color-no-invalid-hex": true,
    "font-family-no-missing-generic-family-keyword": true,
    "declaration-block-no-duplicate-properties": true,
    "shorthand-property-no-redundant-values": true,

    // 6. Naming Conventions (Supports CSS modules & BEM)
    "selector-class-pattern": "^([a-z][a-zA-Z0-9]*|[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?)$",
    "custom-property-pattern": "^([a-z0-9]+-)*[a-z0-9]+$",
    "keyframes-name-pattern": "^[a-z][a-zA-Z0-9_-]+$",

    // 7. Vendor Prefixes with Modern Gradient Text Exceptions
    "property-no-vendor-prefix": [
      true,
      {
        ignoreProperties: [
          "background-clip",
          "-webkit-background-clip",
          "-webkit-text-fill-color"
        ]
      }
    ],
    "value-no-vendor-prefix": true
  },
  overrides: [
    {
      // Exempt raw token and theme definition files from token/unit restrictions
      files: [
        "**/tokens/**/*.css",
        "**/variables.css",
        "**/themes/**/*.css",
        "**/global.css"
      ],
      rules: {
        "color-function-notation": null,
        "function-disallowed-list": null,
        "unit-disallowed-list": null,
        "declaration-property-value-disallowed-list": null,
        "color-named": null,
        "color-no-hex": null,
        "selector-max-universal": null
      }
    }
  ]
};
