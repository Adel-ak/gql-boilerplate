module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],

  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 0,
    'prettier/prettier': ['error'],
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-namespace': 0,
  },

  globals: {
    __dirname: 'off',
    __filename: 'off',
    exports: 'off',
    module: 'off',
    require: 'off',
  },
};
