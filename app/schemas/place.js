/* eslint no-invalid-this: 0 */
'use strict';

const mongoose = require('mongoose');

const config = require('../config');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: ''
	},
	createdAt: {
		type: Date,
		expires: config.get('mongodb:recordExpirationSeconds'),
		default: Date.now
	}
});

module.exports = PlaceSchema;
