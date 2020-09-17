"use strict";

const _ = require("lodash");
const path = require("path");
const { safeCompare } = require("express-basic-auth");

const { CollectionFile } = require("sb-collection-file");

const { User } = require("./user");

class UsersStore {
	constructor({ configLoader }) {
		const directory = configLoader.getValue("storage.databaseDirectory");
		this.structureCollectionFile = {
			idName: "name",
			jsonSchema: {
				type: "object",
				properties: {
					name: { type: "string" },
					password: { type: "string", minLength: 4 },
					active: { type: "boolean", default: true },
					description: { type: "string" },
				},
				additionalProperties: false,
				required: [ "name", "password", "active" ],
			},
			searchIndex: [ "name", "description" ],
		};

		this.collectionFile = new CollectionFile(path.join(directory, "users"));

		this._loginUser = null;
		this._usersExpressBasicAuth = null;
	}

	async initialize() {
		try {
			await this.collectionFile.loadCollection();
		} catch (error) {
			if (error.code !== "ENOENT") {
				throw error;
			}
			await this.collectionFile.create(this.structureCollectionFile);
			await this.collectionFile.insert({
				name: "serge",
				password: "achanger",
				active: true,
				description: "Administrateur",
			});
		}
	}

	set loginUser(name) {
		const user = this.collectionFile.collection.getById(name);
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
			this.collectionFile.collection.find({ active: true }),
			({ name, password }) =>
				// eslint-disable-next-line no-bitwise
				safeCompare(nameInput, name) & safeCompare(passwordInput, password),
		);
	}

	search({ query, search }) {
		return this.collectionFile.collection.search({ query, search })
			.map((user) => new User(user).jsonPrivate);
	}

	getUserByName({ name }) {
		const user = this.collectionFile.collection.getById(name);
		if (!user) {
			return null;
		}
		return new User(user);
	}

	async insert(userInfos) {
		const { document: user } = await this.collectionFile.insert(new User(userInfos).json);
		return new User(user);
	}

	async update(userUpdateInfos) {
		const userInfos = this.collectionFile.collection.getById(userUpdateInfos.name);
		if (!userInfos) {
			throw new Error("userNotfound");
		}
		const user = new User({ ...userInfos, ..._.omitBy(userUpdateInfos, _.isUndefined) });
		const { document: userUpdate } = await this.collectionFile.update(user.json);
		return new User(userUpdate);
	}

	async delete({ name }) {
		const userInfos = this.collectionFile.collection.getById(name);
		if (!userInfos) {
			throw new Error("userNotfound");
		}
		const user = new User(userInfos);
		if (user.isAdmin) {
			throw new Error("unauthorized");
		}
		await this.collectionFile.delete(name);
	}
}

module.exports = { UsersStore };
