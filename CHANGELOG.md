# Changelog

## Unreleased

## 8.0.0-beta.5

- Fixed `browser` aliases field in `package.json`
- Moved browser build from `postinstall` to `prepare`
- restrict npm version to >=7.0 <10

## 8.0.0-beta.4

- Don't overwrite `window.signalfx` ([#87](https://github.com/signalfx/signalfx-nodejs/pull/87))

## 8.0.0-beta.2

- Include browser build in the package ([#86](https://github.com/signalfx/signalfx-nodejs/pull/86))

## 8.0.0-beta.1

- Dropped support for Node.js below `12.10` ([#85](https://github.com/signalfx/signalfx-nodejs/pull/85))
- Significant dependencies updates ([#85](https://github.com/signalfx/signalfx-nodejs/pull/85))
- Replaced browserify with webpack ([#85](https://github.com/signalfx/signalfx-nodejs/pull/85))
- `proxy` configuration field now follows axios's format ([#85](https://github.com/signalfx/signalfx-nodejs/pull/85))

## 7.4.2

- Stop existing livetail session before creating new one
  ([#78](https://github.com/signalfx/signalfx-nodejs/pull/78))

## 7.4.1

- Extend supported Node.js versions to 17.
  ([#73](https://github.com/signalfx/signalfx-nodejs/pull/73))
- Remove info message about missing signalfx-tracing.
  ([#74](https://github.com/signalfx/signalfx-nodejs/pull/74))

## 7.4.0

- Extend supported Node.js versions to latest LTS
  ([#69](https://github.com/signalfx/signalfx-nodejs/pull/69))
