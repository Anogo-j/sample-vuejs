"use strict";

const _ = require("lodash");
const decamelizeKeys = require("decamelize-keys");

class User {
	constructor({ name, password, active = true, description }) {
		this.name = name;
		this.password = password;
		this.active = active || this.name === "serge";
		this.description = description;
		this._isAdmin = this.name === "serge";
	}

	get isAdmin() {
		return this._isAdmin;
	}

	get jsonPublic() {
		return {
			name: this.name,
			description: this.description,
			is_admin: this.isAdmin,
		};
	}

	get jsonPrivate() {
		return {
			name: this.name,
			password: this.password,
			active: this.active,
			description: this.description,
			is_admin: this.isAdmin,
		};
	}

	get json() {
		return decamelizeKeys(_.omitBy(this, (value, key) => key.startsWith("_")));
	}
}

module.exports = { User };
