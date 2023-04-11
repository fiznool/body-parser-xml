# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.5] - 2023-04-11

### Fixed

- Downgraded mocha from v10 to v8 so that tests still work when run against node 10.

## [2.0.4] - 2023-04-11

### Updated

- Update xml2js dependency to fix [a reported vulnerability](https://github.com/Leonidas-from-XIV/node-xml2js/issues/663).
- Update other dependencies and test against node 18.

## [2.0.3] - 2021-05-19

### Fixed

- Fixed prototype pollution vulnerability #69 - thanks to @yadhukrishnam for disclosing and fixing

## [2.0.2] - 2021-05-11

### Added

- Official support for node 16.

## [2.0.1] - 2020-12-02

### Updated

- Update dependencies and test against node 14.

## [2.0.0] - 2020-03-25

### Fixed

- Ensure `done` callback is not called multiple times #4
- Support bodyparser's 'type' option as function #5

### Breaking

- Remove support for node < 10

## [1.1.0] - 2016-03-18

### Added

- Ability to set a custom `Content-Type` for the expected XML-formatted request.

## 1.0.0 - 2015-12-19

Initial Release.

[2.0.5]: https://github.com/fiznool/body-parser-xml/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/fiznool/body-parser-xml/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/fiznool/body-parser-xml/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/fiznool/body-parser-xml/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/fiznool/body-parser-xml/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/fiznool/body-parser-xml/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/fiznool/body-parser-xml/compare/v1.0.0...v1.1.0
