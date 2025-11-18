/* global module */
module.exports = {
  parser: '@typescript-eslint/parser', 
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', 
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off', 
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    "react/no-unescaped-entities":'warn',
    '@typescript-eslint/ban-ts-comment':'off',
    'react/no-children-prop':'off',
    'prefer-const':'warn',
    'no-useless-escape':'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        
      },
    },
  ],
};
