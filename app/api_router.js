'use strict';
/* eslint new-cap:0 */

const router = require('express').Router();

const search = require('./controllers/search_controller');
const photos = require('./controllers/photos_controller');

router.get('/search/list', search.list);
router.get('/photos/:reference', photos.get);

module.exports = router;
