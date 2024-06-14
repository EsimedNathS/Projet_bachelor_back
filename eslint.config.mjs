import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  { ignores: ["test/*"]},
  { rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "_",
        argsIgnorePattern: "_" }] }
  }
];