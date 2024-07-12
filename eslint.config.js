import cds from '@sap/eslint-plugin-cds'
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

module.exports = [
  ...cds.configs.recommended,
  ...pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@sap/cds': cds
    },
    rules: {
      ...cds.configs.recommended.rules
    }
  }
]
