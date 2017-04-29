'use strict';

const Search = require('../services/search');

function list(req, res) {
	Search.search().then(content => {
		res.json(content);
	});
}

exports.list = list;
