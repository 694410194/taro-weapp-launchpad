/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': null,
    'selector-type-no-unknown': [true, { ignoreTypes: ['page'] }],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
  },
}
