"use strict";

const express = require("express");
const path = require("path");

const { name: moduleName, version: moduleVersion } = require("../../package.json");

function staticRouterFactory({ configLoader }) {

	// eslint-disable-next-line new-cap
	const router = express.Router();

	/* config */
	router.use("/configuration", function (request, response) {
		response.status(200).json(configLoader.getValue("vuejs", {}));
	});

	/* site */
	router.use(express.static(path.join(__dirname, "../../dist")));

	router.use((request, response) => response.status(404)
		.render("404", { title: `${ moduleName } ${ moduleVersion }` }));

	return router;
}

module.exports = { staticRouterFactory };
