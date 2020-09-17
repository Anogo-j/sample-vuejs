
import _ from "lodash";
import axios from "axios";
import { eventBus, eventName } from "../eventBus.js";

const configurationStore = {
	state: {
		configuration: {},
	},
	getValue(fromPath, defaultValue) {
		return _.cloneDeep(_.get(this.state.configuration, fromPath, defaultValue));
	},
	async load() {
		const { data } = await axios({
			method: "get", url: "configuration",
		});
		this.state.configuration = data;
		eventBus.$emit(eventName.CONFIGURATION_LOADED);
	},
};

export { configurationStore };
