module.exports = {
  extends: 'airbnb',
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'class-methods-use-this': 0,
    'prefer-destructuring': 0,
    'max-len': 0,
    'no-param-reassign': 0,
    'no-nested-ternary': 0,
    'no-unused-vars': 0,
    'no-empty': 0,
    'no-await-in-loop': 0,
    'no-return-await': 0,
    'consistent-return': 0,
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    'arrow-body-style': 0,
    'arrow-parens': [2, 'always'],
  },
};
