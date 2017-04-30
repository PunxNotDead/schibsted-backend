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
			openingHours: opening_hours,
			rating,
			vicinity
		})
	);
}

function saveSearchRequest(query) {
	return response => {
		const results = processRawSearchResults(response);

		const item = new SearchRequest({
			query,
			results,
			nextPageToken: response.next_page_token
		});

		return item.save().then(() => results);
	};
}

function search(query = '') {
	return SearchRequest.findOne({
		query
	})
	.exec()
	.then(item => {
		if (item) {
			return item.results;
		}

		const options = {
			uri: config.get('searchUrl'),
			qs: {
				location: config.get('location'),
				key: config.get('apiKey'),
				radius: config.get('radius'),
				type: config.get('locationType'),
				keyword: query
			},
			headers: {
				'User-Agent': 'Request-Promise'
			},
			json: true
		};

		return request(options)
			.then(saveSearchRequest(query));
	});
}

exports.search = search;
exports.processRawSearchResults = processRawSearchResults;
