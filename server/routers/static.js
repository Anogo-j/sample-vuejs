"use strict";

const express = require("express");
const path = require("path");

function staticRouterFactory({ configLoader, ejs }) {

	// eslint-disable-next-line new-cap
	const router = express.Router();

	/* config */
	router.use("/configuration", function (request, response) {
		response.status(200).json(configLoader.getValue("vuejs", {}));
	});

	/* site */
	router.use(express.static(path.join(__dirname, "../../dist")));

	router.use((request, response) => ejs.render({ response, status: 404, ejs: "404" }));

	return router;
}

module.exports = { staticRouterFactory };
