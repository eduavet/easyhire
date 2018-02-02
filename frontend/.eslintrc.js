module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
  },
  'parserOptions': {
    'ecmaFeatures': {
      'ecmaVersion': 8,
      'experimentalObjectRestSpread': true,
      'jsx': true
    },
    'sourceType': 'module'
  },
  'rules': {
    'no-param-reassign': 0,
    'no-nested-ternary': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'react/require-default-props': 0,
    'import/extensions': ['.js', '.jsx'],
    'import/no-named-as-default': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'react/forbid-prop-types': ['any'],
    'jsx-a11y/anchor-is-valid': [ 'error', {
      'components': [ 'Link' ],
      'specialLink': [ 'hrefLeft', 'hrefRight' ],
      'aspects': [ 'noHref', 'invalidHref', 'preferButton' ]
    }],
    'react/no-unescaped-entities' : [0],
    'react/no-string-refs': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/no-noninteractive-element-interactions':[0],
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/label-has-for': [0],
    'prefer-destructuring': ['error', {
      'array': false,
      'object': false
    }, {
      'enforceForRenamedProperties': false
    }],
    'react/jsx-max-props-per-line': [true, { 'maximum': 3, 'when': 'multiline' }],
    'array-callback-return': [0],
    'consistent-return': [0],
    }
};

