// apps/processor-node/.eslintrc.cjs
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    semi: [ 'warn', 'never' ],
    quotes: [ 'warn', 'single' ],
    indent: [ 'warn', 'tab', {
      SwitchCase: 1,
      ignoredNodes: [ 'TemplateLiteral' ]
    }],
    'no-console': 'off',
    'no-case-declarations': 'off',
    'no-empty': [ 'warn', {
      allowEmptyCatch: true
    }],
    'no-trailing-spaces': 'off',
    'no-unused-vars': 'warn',
    'no-mixed-spaces-and-tabs': 'off',
    'object-curly-spacing': [ 'warn', 'always', {
      arraysInObjects: true,
      objectsInObjects: true
    }],
    'array-bracket-spacing': [ 'warn', 'always', {
      singleValue: true,
      objectsInArrays: false,
      arraysInArrays: false
    }],
    'template-curly-spacing': 'off',
  }
};
