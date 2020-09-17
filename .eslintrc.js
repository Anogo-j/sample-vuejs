"use strict";

module.exports = {
	root: true,
	env: {
		mocha: true,
	},
	plugins: [ "node" ],
	extends: [ "./.eslint_perso.js", "plugin:node/recommended" ],
	rules: {
		"node/no-deprecated-api": "warn",
	},
};
