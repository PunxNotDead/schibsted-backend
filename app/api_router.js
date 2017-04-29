const router = require('express').Router();

const search = require('./controllers/search_controller');

router.get('/search/list', search.list);

module.exports = router;
