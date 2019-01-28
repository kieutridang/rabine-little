const ECMA_VERSION = 8;
const INDENTATION_SPACES = 2;
const INDENTATION_SWITCH_CASES = 1;
const MAX_LINES = 1000;
const MAX_STATEMENTS = 50;
const MAX_PARAMS = 4;

module.exports = {
  env: {
    es6: true,
    node: true
  },
  plugins: [
    'node',
    'security',
    'import'
  ],
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    'plugin:security/recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true
    },
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
      node: {
        extensions: ['.js', '.json']
      }
    }
  },
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        styl: 'never',
        css: 'never'
      }
    ],
    'node/no-unpublished-require': 'off',
    'node/no-unsupported-features': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 1,
    'object-shorthand': 'off',
    'object-curly-newline': 'off',
    'block-scoped-var': 'off',
    'padded-blocks': 'off',
    'class-methods-use-this': 'off',
    'no-process-exit': 'off',
    'no-underscore-dangle': 'off',
    'require-jsdoc': 'off',
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-unsafe-regex': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', INDENTATION_SPACES, {
      SwitchCase: INDENTATION_SWITCH_CASES,
      MemberExpression: 'off'
    }],
    'comma-dangle': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'no-debugger': 'error',
    'arrow-body-style': ['off', 'as-needed', {
      requireReturnForObjectLiteral: true
    }],
    'func-names': ['warn', 'always'],
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-shadow': 'warn',
    'max-lines': ['warn', MAX_LINES],
    'max-statements': ['warn', MAX_STATEMENTS],
    'max-params': ['warn', MAX_PARAMS],
    'no-invalid-this': 'warn',
    camelcase: 'warn',
    'func-name-matching': ['warn', 'always'],
    curly: ['warn', 'all'],
    'no-warning-comments': ['warn', {
      terms: ['todo', 'fixme', 'fix me'],
      location: 'anywhere'
    }],
    'no-magic-numbers': ['off', {
      ignoreArrayIndexes: true,
      enforceConst: true,
      detectObjects: true,
      ignore: [
        // Small numbers for basic arithmatic should not be flagged
        -1, 0, 1,
        // 2xx HTTP status codes should not be flagged
        200, 201, 202, 203, 204, 205, 206,
        // 4xx HTTP status codes should not be flagged
        400, 401, 402, 403, 404, 405, 406, 407, 408, 409,
        // 5xx HTTP status codes should not be flagged
        500, 501, 502, 503, 504, 505
      ]
    }]
  }
};
