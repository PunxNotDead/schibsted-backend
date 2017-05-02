'use strict';

const Photos = require('../services/photos');

function get(req, res) {
	Photos.getContent(req.params.reference).pipe(res);
}

exports.get = get;
