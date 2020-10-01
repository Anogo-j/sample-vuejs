"use strict";

const usersJsonSchema = {
	type: "object",
	properties: {
		name: { type: "string" },
		password: { type: "string", minLength: 4 },
		active: { type: "boolean", default: true },
		description: { type: "string" },
	},
	additionalProperties: false,
	required: [ "name", "password", "active" ],
};

module.exports = { usersJsonSchema };
