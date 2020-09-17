<template>
	<div class="sample-vuejs">
		<loader v-if="!meStore.name" />
		<error />

		<div class="content" v-show="meStore.name">
			<app-header :me="meStore"/>
			<infos />
		</div>
	</div>
</template>

<script>
import { meStore } from "./stores/me.store";
import Loader from "./components/loader";
import Error from "./components/error";
import AppHeader from "./components/app-header";
import Infos from "./components/info";

export default {
	name: "SampleVuejs",
	components: { Loader, Error, AppHeader, Infos },
	data: () => ({
		meStore,
	}),
	created: async function () {
		await meStore.loadMe();
	},
};
</script>

<style>
* {
	scrollbar-width: thin;
}

html, body, .test-app {
	height: 100%;
}

.sample-vuejs .content {
	padding: 20px;
	height: 100%;
	background-color: white;
}
</style>
