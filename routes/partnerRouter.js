const express = require('express');

const partnerRouter = express.Router();

partnerRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((req, res) => {
		res.end('Will send all the campsites to you');
	})
	.post((req, res) => {
		res.end(
			`Will add the campsite: ${req.body.name} with description: ${req.body.description}`
		);
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /campsites');
	})
	.delete((req, res) => {
		res.end('Deleting all campsites');
	});

partnerRouter
	.route('/:partnerId')

	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})

	.get((req, res) => {
		res.end(
			`Will send details of the campsite: ${req.params.campsiteId} to you`
		);
	})

	.post((req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operation not supported on /campsiteIds/${req.params.campsiteId}to you`
		);
	})
	.put((req, res) => {
		res.write(`Updating the partner:${req.params.campsiteId}\n`);
		res.end(
			`Will update the partner: ${req.body.name} with description: ${req.body.description}`
		);
	})
	.delete((req, res) => {
		res.end(`Deleting campsite: ${req.params.campsiteId}`);
	});

module.exports = partnerRouter;
