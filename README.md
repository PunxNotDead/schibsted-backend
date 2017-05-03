# Backend part of Schibsted test task

# Prerequirements

* [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)

# Installation and running

* `npm i`

* Edit connection string to MongoDb in proper (`/app/config/development.json` for developing or  `/app/config/test.json`)

* Changes some default search parameters (Google API key, search radius, type)

* `npm start`

# Description

By default apllication runned in cluster mode at localhost:3001, one fork per processor's core. Default database for use is `schibsted_task`.

If you want to run application in single instance mode, set `clusterMode: false` in config.

If we want even more scalability, we can use load balances like [node-http-proxy](https://github.com/nodejitsu/node-http-proxy)

When you are running tests, test isntalce will be runned at localhost:3002, and default test database is `schibsted_task_test`

# API Methods

* /api/search/list?query=MY_QUERY
Searching for bars with additional query / keywords. Query param will be normalized, and then wi will check in database for search results, and respond with them if we have some. If we do not have, we will request Google, parse results, put it in our DB, and respond with results. Records in databse will persist only for one day (can be configured in config)

* /api/photos/:reference
Proxing image request to Google with passed reference

# Technologies

* Express
* Mongoose
* Request for proxing / requesting data
* ESLint for linting
* Bluebird for promises

# Tests

Tests runned automatically on commit.

If you wand to runt it manually, run `npm test`
