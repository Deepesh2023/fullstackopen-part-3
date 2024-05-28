module.exports = {
  env: {
    commonjs: true,
    es2021: true,

    node: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prefer-destructuring': ['error', { object: false, array: true }],
  },
  extends: 'airbnb-base',
};
