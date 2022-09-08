module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true,
    "mocha": true
  },
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],

    // TODO: review this
    "no-prototype-builtins": ["warn"]
  }
};
