process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

describe('Stub', () => {
	it('First', () => {
		expect(true).to.be.true;
	});
});
