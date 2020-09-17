
<template>
	<div class="md-elevation-10 info">
		<div>nom de l'application : <span>{{ infoStore.infos.name }}</span></div>
		<div>version : <span>{{ infoStore.infos.version }}</span></div>
		<div>debug : <span>{{ configurationStore.getValue("debug") }}</span></div>
		<hr>
		<span v-html="infoStore.infos.readme" />
	</div>
</template>

<script>
import { configurationStore } from "../stores/configuration.store";
import { infoStore } from "../stores/info.store";

export default {
	name: "Info",
	data: () => ({
		infoStore,
		configurationStore,
	}),
	created: async function () {
		await infoStore.loadInfos();
	},
};
</script>

<style>
.info {
	padding: 10px;
}
.info span {
	font-weight: bolder;
}
</style>
