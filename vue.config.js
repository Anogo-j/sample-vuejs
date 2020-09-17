"use strict";

const { name: moduleName, version: moduleVersion } = require("./package.json");

module.exports = {
	devServer: {
		proxy: {
			"^/api": { target: "http://localhost:8081" },
			"^/configuration$": { target: "http://localhost:8081" },
			"^/logout$": { target: "http://localhost:8081" },
		},
	},
	chainWebpack: (config) => {
		config.plugin("html").tap((args) => {
			args[0].title = `${ moduleName.split("/")[1] } ${ moduleVersion }`;
			return args;
		});
	},
};
