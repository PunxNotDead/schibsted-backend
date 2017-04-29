const request = require('request-promise');
const _ = require('lodash');

const config = require('../config');

const SearchRequest = require('./mongoose').model('SearchRequest');

function processRawSearchResults(response) {
	const results = response && response.results ? response.results : [];

	return _.map(results, ({id, icon, name, opening_hours, rating, vicinity}) => ({
		id,
		icon,
		name,
		opening_hours,
		rating,
		vicinity
	})
	);
}

function saveSearchRequest(data) {
	const item = new SearchRequest(data);

	return item.save();
}

function search(query) {
	SearchRequest.findOne({
		query: query
	}).exec().then(item => {
		if (item) {
			return item.results;
		}

		const options = {
			uri: config.get('searchUrl'),
			qs: {
				location: config.get('location'),
				key: config.get('apiKey'),
				radius: config.get('radius'),
				type: config.get('locationType')
			},
			headers: {
				'User-Agent': 'Request-Promise'
			},
			json: true
		};

		return request(options)
			.then(processRawSearchResults)
			.then(saveSearchRequest);
	});
}

exports.search = search;
exports.processRawSearchResults = processRawSearchResults;
