import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/", "dist/"],
  },
  {
    files: ["src/**/*.js"],

    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
            presets: ["@babel/preset-env"]
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },

      globals: {
        ...globals.node,
        ...globals.browser,
        require: "readonly",
      },
    },
    rules: {
      "no-var": "error",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_"
        }
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info", "debug"]
        }
      ],
      indent: [
        "error",
        2,
        {
          SwitchCase: 1
        }
      ],
      semi: [
        "error",
        "always"
      ],
      quotes: [
        "error",
        "single",
        {
          allowTemplateLiterals: true
        }
      ],
    }
  },
  {
    files: ["webpack.config.cjs"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        sourceType: "script",
      }
    },
    rules: {
      "no-console": "off",
    }
  }
];
