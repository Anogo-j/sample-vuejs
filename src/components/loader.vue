
<template>
	<transition name="fade">
		<div id="loader"><spinner :animate="true" /></div>
	</transition>
</template>

<script>

import Spinner from "./spinner";

export default {
	name: "Loader",
	components: { Spinner },
	mounted: function () {
		const loader = document.getElementById("loader");
		loader.parentNode.removeChild(loader);
	},
};
</script>

<style>
#loader {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	z-index: 10;
}

#loader .spinner {
	max-width: 800px;
}
</style>
