"use strict";

const path = require("path");
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fs = require("fs").promises;
const markdownIt = require("markdown-it")({ html: true });

const { name, version } = require("../../package.json");

class InfosStore {
	constructor(context) {
		this.context = context;
		this.logger = context.logger;
		this.readme = "";
	}

	async initialize() {
		const readmeFileName = path.join(__dirname, "../../README.md");
		try {
			await fs.access(readmeFileName);
			const readmeMarkdown = await fs.readFile(readmeFileName, "utf8");
			this.readme = markdownIt.render(readmeMarkdown);
		} catch (error) {
			this.logger.log("warn", "error read README.md", { error: error.message });
		}
	}

	async get() {
		return {
			name,
			version,
			readme: this.readme,
		};
	}
}

module.exports = { InfosStore };
