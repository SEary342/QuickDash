// eslint.config.js
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'build',
      'coverage',
      '.github',
      'backend',
      'docs',
      'scripts',
      '.vscode',
      '.venv',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.vitest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules, // Add the actual hooks rules!
      'prettier/prettier': ['error'],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  prettierConfig,
]
