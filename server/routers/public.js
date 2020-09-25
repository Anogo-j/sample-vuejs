"use strict";

const path = require("path");

const express = require("express");
const serveFavicon = require("serve-favicon");

function publicRouterFactory({ ejs, logger }) {

	// eslint-disable-next-line new-cap
	const router = express.Router();

	try {
		router.use(serveFavicon(path.join(__dirname, "../../dist/favicon.ico")));
	} catch (error) {
		logger.log("warn", "error read favicon", { error: error.message });
	}

	router.get(
		"/logout", (request, response) => ejs.render({ response, status: 200, ejs: "logout" }),
	);

	return router;
}

module.exports = { publicRouterFactory };
