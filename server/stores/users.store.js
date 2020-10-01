"use strict";

const _ = require("lodash");
const path = require("path");
const { safeCompare } = require("express-basic-auth");
const { JsonDb } = require("@sbesson/json-db");

const { User } = require("./users/user");
const { usersJsonSchema } = require("./users/user.json-schema");

class UsersStore {
	constructor({ configLoader }) {
		const directory = configLoader.getValue("storage.databaseDirectory");
		this.structureJsonDb = {
			idName: "name",
			jsonSchema: usersJsonSchema,
			searchIndex: [ "name", "description" ],
		};

		this.jsonDb = new JsonDb(path.join(directory, "users"));

		this._loginUser = null;
		this._usersExpressBasicAuth = null;
	}

	async initialize() {
		try {
			await this.jsonDb.loadCollection();
		} catch (error) {
			if (error.code !== "ENOENT") {
				throw error;
			}
			await this.jsonDb.create(this.structureJsonDb);
			await this.jsonDb.insert({
				name: "serge",
				password: "achanger",
				active: true,
				description: "Administrateur",
			});
		}
	}

	set loginUser(name) {
		const user = this.jsonDb.collection.getById(name);
		if (!user) {
			throw new Error(`loginUser - utilisateur ${ name } inconnu`);
		}
		this._loginUser = new User(user);
	}
	get loginUser() {
		return this._loginUser;
	}

	checkAuthentification({ name: nameInput, password: passwordInput }) {
		return _.some(
			this.jsonDb.collection.find({ active: true }),
			({ name, password }) =>
				// eslint-disable-next-line no-bitwise
				safeCompare(nameInput, name) & safeCompare(passwordInput, password),
		);
	}

	search({ query, search }) {
		return this.jsonDb.collection.search({ query, search })
			.map((user) => new User(user).jsonPrivate);
	}

	getUserByName({ name }) {
		const user = this.jsonDb.collection.getById(name);
		if (!user) {
			return null;
		}
		return new User(user);
	}

	async insert(userInfos) {
		const { document: user } = await this.jsonDb.insert(new User(userInfos).json);
		return new User(user);
	}

	async update(userUpdateInfos) {
		const userInfos = this.jsonDb.collection.getById(userUpdateInfos.name);
		if (!userInfos) {
			throw new Error("userNotfound");
		}
		const user = new User({ ...userInfos, ..._.omitBy(userUpdateInfos, _.isUndefined) });
		const { document: userUpdate } = await this.jsonDb.update(user.json);
		return new User(userUpdate);
	}

	async delete({ name }) {
		const userInfos = this.jsonDb.collection.getById(name);
		if (!userInfos) {
			throw new Error("userNotfound");
		}
		const user = new User(userInfos);
		if (user.isAdmin) {
			throw new Error("unauthorized");
		}
		await this.jsonDb.delete(name);
	}
}

module.exports = { UsersStore };
