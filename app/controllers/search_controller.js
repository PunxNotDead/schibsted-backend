'use strict';

const Errors = require('../services/errors');
const Search = require('../services/search');

function list(req, res) {
	Search.search(req.query.query)
		.then(data => {
			res.json(data);
		})
		.catch(Errors.defaultErrorHandler(res));
}

exports.list = list;
