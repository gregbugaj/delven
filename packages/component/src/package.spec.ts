
// https://github.com/mattphillips/jest-chain/issues/1
// Workaround for https://github.com/mattphillips/jest-chain/issues/1
const it2 = (message, fn) => it(message, async (...args) => fn(...args));

describe('console package', () => {

	it2('support code coverage statistics', () => true);
});
