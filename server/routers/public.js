"use strict";

const path = require("path");

const express = require("express");
const serveFavicon = require("serve-favicon");

const { name: moduleName, version: moduleVersion } = require("../../package.json");

function publicRouterFactory() {

	// eslint-disable-next-line new-cap
	const router = express.Router();

	router.use(serveFavicon(path.join(__dirname, "../../dist/favicon.ico")));

	router.get("/logout", (request, response) => response.status(200)
		.render("logout", { title: `${ moduleName } ${ moduleVersion }` }));

	return router;
}

module.exports = { publicRouterFactory };
