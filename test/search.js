'use strict';

process.env.NODE_ENV = 'test';

const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index');

const expect = chai.expect;

const Search = require('../app/services/search');
const SearchRequest = require('../app/services/mongoose').model('SearchRequest');

chai.use(chaiHttp);

function validateListItem(item) {
	expect(item).to.be.an('object');

	expect(item).to.have.property('gogoleId').that.is.a('string');
	expect(item).to.have.property('icon').that.is.a('string');
	expect(item).to.have.property('name').that.is.a('string');
	expect(item).to.have.property('rating').that.is.a('number');
	expect(item).to.have.property('vicinity').that.is.a('string');
	expect(item).to.have.property('photo').satisfy(photo => (_.isNull(photo) || _.isString(photo)));
}

before(done => {
	SearchRequest.remove({})
		.then(() => {
			done(null);
		})
		.catch(done);
});

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
			expect(result).to.be.deep.equal(expected);
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
			const query = 'beer';
			const searchUrl = `/api/search/list?query=${encodeURIComponent(query)}`;

			function checkBeforeSearch(savedRequest) {
				expect(savedRequest).to.be.null;
			}

			function checkResponseAndFindSaved(res) {
				expect(res).to.have.status(200);

				_.each(res.body, validateListItem);

				return SearchRequest.findOne({query}).exec();
			}

			function checkIsResultSaved(savedRequest) {
				expect(savedRequest).to.be.not.null;

				_.each(savedRequest.results, validateListItem);
			}

			function getSavedRequestsResultsCount() {
				return SearchRequest.count(query);
			}

			function checkSavedRequestsResultsCount(counter) {
				expect(counter).to.be.equal(1);
			}

			function requestApi() {
				return chai.request(server).get(searchUrl);
			}

			return SearchRequest.findOne({query})
				.exec()
				.then(checkBeforeSearch)
				.then(requestApi)
				.then(checkResponseAndFindSaved)
				.then(checkIsResultSaved)
				.then(requestApi)
				.then(getSavedRequestsResultsCount)
				.then(checkSavedRequestsResultsCount);
		});
	});
});
