module.exports = {
  root: true,
  extends: ['taro/react'],
  overrides: [
    {
      files: ['*.cjs', '*.config.js', 'babel.config.js'],
      rules: {
        'import/no-commonjs': 'off',
      },
    },
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
