'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config');

mongoose.Promise = bluebird;

mongoose.connect(config.get('mongodb:host'), config.get('mongodb:mongooseOptions') || {});

mongoose.model('Place', require('../schemas/place'), 'places');
mongoose.model('SearchRequest', require('../schemas/search-request'), 'search_requests');

module.exports = mongoose;
