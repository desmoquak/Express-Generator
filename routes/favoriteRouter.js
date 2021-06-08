const express = require('express');
const mongoose = require('mongoose');
const favoriteRouter = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const Schema = mongoose.Schema;
const Favorite = require('../models/favorites');

favoriteRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		if (!req.user || !req.user._id) {
			res.status(500).send({ message: 'Missing User Info' });
			return;
		}
		Favorite.find({ user: req.user._id })
			.populate('user')
			.populate('campsites')
			.then((favorites) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorites);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }).then((favorite) => {
			if (favorite) {
				req.body.forEach((fav) => {
					if (!favorite.campsites.push(fav._id)) {
						favorite.campsites.push(fav._id);
					}
				});
				favorite
					.save()
					.then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.catch((err) => next(err));
			} else {
				Favorite.create({ user: req.user._id }).then((favorite) => {
					req.body.forEach((fav) => {
						if (!favorite.campsites.push(fav._id)) {
							favorite.campsites.push(fav._id);
						}
					});
					favorite
						.save()
						.then((favorite) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorite);
						})
						.catch((err) => next(err));
				});
			}
		});
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res) => {
			res.statusCode = 403;
			res.end('PUT operation not supported on /favorites');
		}
	)
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOneAndDelete({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					if (favorite.campsites.indexOf(req.user._id !== 1)) {
						favorite.campsites
							.splice(favorite.campsites.indexOf(req.user._id), 1)
							.then((responseFavorite) => {
								console.log('Deleted.');
								res.setHeader(
									'Content-Type',
									'application/json'
								);
								res.statusCode = 200;
								res.json(responseFavorite);
								res.end(
									'You do not have a favorites to delete.'
								);
							})
							.catch((err) => next(err));
					} else {
					}
				}
			})
			.catch((err) => next(err));
	});

//

favoriteRouter
	.route('/:campsiteId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res) => {
		Favorite.find()
			.then((favorites) => {
				res.statusCode = 403;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorites);
				res.end(
					`GET operation not supported on /campsites/${req.params.campsiteId}`
				);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		favoriteRouter.findOne({ user: req.user._id }).then((favorite) => {
			if (favorite) {
				req.body.forEach((fav) => {
					if (!favorite.campsites.push(fav._id)) {
						favorite.campsites.push(fav._id);
					}
				});
				favorite
					.save()
					.then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.catch((err) => next(err));
			} else {
				Favorite.create({ user: req.user._id }).then((favorite) => {
					req.body.forEach((fav) => {
						if (!favorite.campsites.push(fav._id)) {
							favorite.campsites.push(fav._id);
						}
					});
					favorite
						.save()
						.then((favorite) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorite);
						})
						.catch((err) => next(err));
				});
			}
		});
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,

		(req, res) => {
			res.statusCode = 403;
			res.end(
				`PUT operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
			);
		}
	)
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					if (favorite.campsites.indexOf(req.user._id !== 1)) {
						favorite.campsites
							.splice(favorite.campsites.indexOf(req.user._id), 1)
							.then((responseFavorite) => {
								console.log('Deleted.');
								res.setHeader(
									'Content-Type',
									'application/json'
								);
								res.statusCode = 200;
								res.json(favorite);
							})
							.catch((err) => next(err));
					} else {
						res.setHeader('Content-Type', 'text/plain');
						res.end('You do not have any favorites to delete.');
					}
				}
			})
			.catch((err) => next(err));
	});

//

module.exports = favoriteRouter;

// "insertedIds" : [
//     ObjectId("60be1a4a22e93b5ae4ca17d1"),
//     ObjectId("60be1a4a22e93b5ae4ca17d2"),
//     ObjectId("60be1a4a22e93b5ae4ca17d3")
// ]

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGI2ZTY3YTEwZmVlYTA4MTc4ZGUyNjEiLCJpYXQiOjE2MjMwOTAyMTYsImV4cCI6MTYyMzA5MzgxNn0.zl9WCjIfjdfc-bEXmeJoc-shxzpWh3AWQfuBNmEGxzY"
