"use strict";

const path = require("path");

class Ejs {
	constructor({ app, data = {} }) {
		app.set("views", path.join(__dirname, "../ejsPages"));
		app.set("view engine", "ejs");
		this.data = data;
	}

	render({ response, status, ejs, data = {} }) {
		return response.status(status).render(ejs, { ...this.data, ...data });
	}
}

module.exports = { Ejs };
