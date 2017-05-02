'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressDomainMiddleware = require('express-domain-middleware');
const cluster = require('cluster');
const cpus = require('os').cpus().length;

const apiRouter = require('./app/api_router');
const config = require('./app/config');

let server = null;

function createServer() {
	const app = express();

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(expressDomainMiddleware);

	app.use('/api', apiRouter);

	app.use((err, req, res, next) => {
		res.status(500).send({
			errors: [err.toString()]
		});
	});

	const serverInstance = app.listen(config.get('port'), () => {
		let host = serverInstance.address().address;
		let port = serverInstance.address().port;

		console.log('Listening at http://%s:%s', host, port);
	});

	return serverInstance;
}

if (!config.get('clusterMode')) {
	server = createServer();
} else {
	if (cluster.isMaster) {
		for (let i = 0; i < cpus; i++) {
			cluster.fork();
		}

		cluster.on('exit', worker => {
			console.log(`Worker ${worker.id} exited, respawning...`);
			cluster.fork();
		});
	} else {
		createServer();
	}
}

module.exports = server;
