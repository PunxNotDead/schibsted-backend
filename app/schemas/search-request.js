/* eslint no-invalid-this: 0 */
'use strict';

const mongoose = require('mongoose');

const config = require('../config');

const Schema = mongoose.Schema;

const SearchRequestSchema = new Schema({
	query: {
		type: String,
		trim: true,
		default: '',
	},

	results: [{
		id: {
			type: String,
			trim: true,
			default: '',
		},
		icon: {
			type: String,
			trim: true,
			default: '',
		},
		name: {
			type: String,
			trim: true,
			default: '',
		},
		opening_hours: {
			open_now: Boolean
		},
		rating: Number,
		vicinity: String
	}],
	createdAt: {
		type: Date,
		expires: config.get('mongodb:recordExpirationSeconds'),
		default: Date.now
	}
});

module.exports = SearchRequestSchema;
