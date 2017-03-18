module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": [
    "standard",
    "standard-react",
    "react-app"
  ],
  "parser": "babel-eslint",
  //"extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "eslint-plugin-flowtype"
  ],
  "rules": {
    "indent": [
      2,
      2, { "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "flowtype/define-flow-type": 1,
    "flowtype/use-flow-type": 1,
    "space-before-function-paren": 0,
    "jsx-quotes": 0,
    "react/jsx-no-bind": 0,
    "generator-star-spacing": 0,
    "react/jsx-no-undef": 1,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "no-unused-vars": 1,
    "prefer-const": 1,
    "space-in-parens": 0,
    "space-before-blocks": 0
  }
};