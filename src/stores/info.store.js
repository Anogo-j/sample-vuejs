
import axios from "axios";
import { eventBus, eventName } from "../eventBus";

const infoStore = {
	state: {
		infos: {},
	},

	get infos() {
		return this.state.infos;
	},
	async loadInfos() {
		try {
			const { data } = await axios({ method: "get", url: "api/infos" });
			this.state.infos = data;
		} catch (error) {
			eventBus.$emit(
				eventName.ERROR, "Impossible de récupérer les informations de l'api", error,
			);
		}
	},
};

export { infoStore };
