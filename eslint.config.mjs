import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
   {
      files: ['**/*.{js,mjs,cjs}'],
      plugins: { js },
      extends: ['js/recommended'],
   },
   { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
   { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
   {
      files: ['**/*.test.js', '**/*.spec.js'],
      languageOptions: {
         globals: {
            ...globals.jest, // Ajoute tous les globals Jest, dont test, describe, it
         },
      },
   },
   {
      rules: {
         'no-unused-vars': 'warn',
         indent: ['off'],
         quotes: ['off'],
         semi: ['warn', 'always'],
         'no-console': ['off'],
         'no-var': 'error',
      },
   },
]);
