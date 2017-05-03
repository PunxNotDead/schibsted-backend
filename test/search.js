'use strict';

process.env.NODE_ENV = 'test';

const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const Search = require('../app/services/search');

chai.use(chaiHttp);

function validateListItem(item) {
	expect(item).to.be.an('object');

	expect(item).to.have.property('gogoleId').that.is.a('string');
	expect(item).to.have.property('icon').that.is.a('string');
	expect(item).to.have.property('name').that.is.a('string');
	expect(item).to.have.property('rating').that.is.a('number');
	expect(item).to.have.property('vicinity').that.is.a('string');
	expect(item).to.have.property('photo').that.is.a('string');
}

describe('Search', () => {
	describe('normalizeQuery', () => {
		it('should return proper value for Non-epmty string', () => {
			const rawData = '     MaNy SPACES and    Words    ';
			const result = Search.normalizeQuery(rawData);
			const expected = 'many spaces and words';

			expect(result).to.be.equal(expected);
		});

		it('should return empty string for Null value', () => {
			const rawData = null;
			const result = Search.normalizeQuery(rawData);
			const expected = '';

			expect(result).to.be.equal(expected);
		});
	});

	describe('processRawSearchResults', () => {
		it('should return empty array for Null value', () => {
			const rawData = null;
			const result = Search.processRawSearchResults(rawData);
			const expected = [];

			expect(result).to.be.instanceof(Array);
			expect(result).to.be.empty;
		});

		it('should properly process response from Google', () => {
			const rawData = require('./data/search/list-response.json');
			const result = Search.processRawSearchResults(rawData);
			const expected = require('./data/search/list-result.json');

			expect(result).to.be.instanceof(Array);

			_.each(result, validateListItem);

			expect(result).to.be.deep.equal(expected);
		});
	});

	describe('GET /api/search/list', () => {
		it('should request Google and send processed response', () => {
			return chai.request(server)
				.get('/api/search/list')
				.then(res => {
					expect(res).to.have.status(200);

					_.each(res.body, validateListItem);
				});
		})
	});
});
