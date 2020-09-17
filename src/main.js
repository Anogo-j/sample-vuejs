import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import SampleVuejs from "./sample-vuejs.vue";
import { configurationStore } from "./stores/configuration.store";

Vue.config.productionTip = false;
Vue.use(VueMaterial);

async function main() {

	await configurationStore.load();
	new Vue({
		render: createElement => createElement(SampleVuejs),
	}).$mount("#sample-vuejs");
}

main().catch((error) => {
	// eslint-disable-next-line no-console
	console.error("Erreur Chargement de la configuration du site", error);
	location.replace("/error.html");
});
