"use strict";

const path = require("path");
const _ = require("lodash");
const requireGlob = require("require-glob");
const { pascalCase, pascalCaseTransformMerge } = require("pascal-case");

class StoreManager {

	constructor({ path: storesPath, context }) {
		this.path = storesPath;
		this.context = context;
	}

	async loadInContext() {
		const requireStores = await requireGlob(path.join(this.path, "*.store.js"));
		await Promise.all(_.map(requireStores, async(store, storeName) => {
			this.context[storeName] = new store[
				pascalCase(storeName, { transform: pascalCaseTransformMerge })
			](this.context);
			return await this.context[storeName].initialize();
		}));
	}
}

module.exports = { StoreManager };
