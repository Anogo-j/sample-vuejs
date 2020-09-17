<template>
	<md-dialog-alert class="error"
		:md-active.sync="show"
		md-title="ERREUR"
		:md-content="content"
	/>
</template>

<script>
import _ from "lodash";
import { eventBus, eventName } from "../eventBus";


export default {
	name: "Error",
	data: () => ({
		show: false,
		message: "",
		errorDescription: "",
	}),
	computed: {
		content: function () {
			return `${ this.message } <span>${ this.errorDescription }</span>`;
		},
	},
	created: function () {
		eventBus.$on(eventName.ERROR, (message, error) => {
			this.showError(message, error);
		});
	},
	methods: {
		showError: function (message, error) {
			if (this.show) {
				return;
			}

			this.message = message;
			const errorMessage = _.get(error, "message");
			const errorDescription = _.get(error, "response.data.error_description");
			this.errorDescription = `${ errorMessage }${ errorDescription ? ` (${errorDescription})` : "" }`;
			this.show = true;
		},
	},
};
</script>

<style>
.md-dialog.error  .md-dialog-container {
	background-color: #dd3232;
	color: var(--md-theme-default-text-primary-on-accent, #fff);
}
.md-dialog.error .md-dialog-content span {
	display: block;
	font-size: .9em;
	color: #1212bb;
	font-style: italic;
}
</style>
