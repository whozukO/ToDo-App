import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      prettier: eslintPluginPrettier,
    },
    extends: ['js/recommended', eslintConfigPrettier],
    languageOptions: { globals: globals.browser },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules,
      // 'no-console': 'warn',
      eqeqeq: 'warn',
      curly: 'warn',
      'no-else-return': 'warn',
    },
  },
])
