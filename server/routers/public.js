"use strict";

const path = require("path");

const express = require("express");
const serveFavicon = require("serve-favicon");

function publicRouterFactory({ ejs }) {

	// eslint-disable-next-line new-cap
	const router = express.Router();

	router.use(serveFavicon(path.join(__dirname, "../../dist/favicon.ico")));

	router.get(
		"/logout", (request, response) => ejs.render({ response, status: 200, ejs: "logout" }),
	);

	return router;
}

module.exports = { publicRouterFactory };
