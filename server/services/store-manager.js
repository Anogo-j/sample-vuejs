"use strict";

const path = require("path");
const _ = require("lodash");
const requireGlob = require("require-glob");
const { pascalCase, pascalCaseTransformMerge } = require("pascal-case");

class StoreManager {

	constructor({ path: storesPath, context }) {
		this.path = storesPath;
		this.context = context;
		this.context.stores = {};
	}

	async loadInContext() {
		const requireStores = await requireGlob(path.join(this.path, "*.store.js"));
		_.forEach(requireStores, (store, storeName) => {
			this.context.stores[storeName] = new store[
				pascalCase(storeName, { transform: pascalCaseTransformMerge })
			](this.context);
		});
		await Promise.all(
			_.map(this.context.stores, async(store) => await store.initialize(this.context)),
		);
	}
}

module.exports = { StoreManager };
