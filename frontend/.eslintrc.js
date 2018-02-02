module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
  },
  rules: {
    'no-param-reassign': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/extensions': ['.js', '.jsx'],
    'import/no-named-as-default': 0,
  },
};
