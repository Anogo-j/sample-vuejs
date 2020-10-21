<template>
	<div class="sample-vuejs">
		<loader v-if="!meStore.name" />
		<error />

		<md-app md-waterfall md-mode="fixed" v-show="meStore.name" class="md-elevation-10">
			<md-app-toolbar class="md-primary">
				<span class="md-title">Sample Vue.js</span>
				<div class="md-toolbar-section-end">
					<profile-menu v-if="meStore.name" :name="meStore.name">
						<md-divider />
						<md-menu-item href="/api" target="_blank">
							<md-icon>api</md-icon>
							<span>api</span>
						</md-menu-item>
					</profile-menu>
				</div>

			</md-app-toolbar>

			<md-app-drawer md-permanent="full">
				<md-toolbar class="md-transparent" md-elevation="0">
					Navigation
				</md-toolbar>
				<md-list>
					<md-list-item>
						<span class="md-list-item-text">Choix 1</span>
					</md-list-item>
				</md-list>
			</md-app-drawer>

			<md-app-content>
				<app-header :me="meStore"/>
				<infos />
			</md-app-content>
		</md-app>
	</div>
</template>

<script>
import { meStore } from "./stores/me.store";
import Loader from "./components/loader";
import Error from "./components/error";
import ProfileMenu from "./components/profile-menu";
import AppHeader from "./components/app-header";
import Infos from "./components/info";

export default {
	name: "SampleVuejs",
	components: { Loader, Error, ProfileMenu, AppHeader, Infos },
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

html, body, .sample-vuejs {
	height: 100%;
	overflow: hidden;
}

.sample-vuejs .md-drawer {
	width: 110px;
}

.sample-vuejs .md-app {
	margin: 20px;
	height: calc(100% - 40px);
}
</style>
