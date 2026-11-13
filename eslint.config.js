import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Shared with the mobile app: no DOM globals or web-only UI and map libraries.
    files: [
      'src/{services,domain,types,utils,config}/**/*.{ts,tsx}',
      'src/platform/{index,types}.ts',
      'src/hooks/**/*.{ts,tsx}',
    ],
    ignores: ['src/hooks/useIsMobile.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['leaflet', 'react-leaflet'],
          patterns: ['@mui/*', '@emotion/*'],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'Use getPlatform() or a standard global instead.' },
        { name: 'document', message: 'Shared code must not touch the DOM.' },
        { name: 'localStorage', message: 'Use getPlatform().storage instead.' },
        { name: 'navigator', message: 'Use getPlatform().geolocation instead.' },
      ],
    },
  }
)
