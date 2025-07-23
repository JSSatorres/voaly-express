module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard-with-typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['.eslintrc.js', 'node_modules/', '.build/', '.serverless/'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
  }
}
