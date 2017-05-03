'use strict';

const mongoose = require('mongoose');

const config = require('../config');

const Schema = mongoose.Schema;

const SearchRequestSchema = new Schema({
	query: {
		type: String,
		trim: true,
		default: '',
		index: {
			unique: true
		}
	},

	results: [{
		gogoleId: String,
		icon: String,
		photo: String,
		name: String,
		rating: Number,
		vicinity: String
	}],

	createdAt: {
		type: Date,
		expires: config.get('mongodb:recordExpirationSeconds'),
		default: Date.now
	},

	nextPageToken: String
});

module.exports = SearchRequestSchema;
