'use strict';

const request = require('request');

const config = require('../config');

function getContent(reference) {
	const options = {
		uri: config.get('photoUrl'),
		qs: {
			key: config.get('apiKey'),
			photoreference: reference,
			maxwidth: config.get('maxPhotoWidth')
		}
	};

	return request(options);
}


exports.getContent = getContent;
