<template>
	<div class="md-elevation-10 header">
		<div>
			Bonjour <span>{{ me.name }}</span>
		</div>
		<md-button @click="logout">
			<md-icon>exit_to_app</md-icon><span>déconnexion</span>
		</md-button>
	</div>
</template>

<script>
export default {
	name: "AppHeader",
	props: {
		me: {
			type: Object,
			default: () => ({ name: "inconnu" }),
		},
	},
	methods: {
		logout: async function () {
			const xhr = new window.XMLHttpRequest();
			xhr.addEventListener("loadend", () => {
				window.location.assign("/logout");
			});
			xhr.open("HEAD", window.location.href, true, "logout", "logout");
			xhr.send(null);
		},
	},
};
</script>

<style>
.header {
	margin-bottom: 20px;
	padding: 10px;
	font-size: 40px;
	line-height: 40px;
	display: flex;
}
.header > div {
	flex: 1;
}
.header span {
	font-weight: bolder;
}
.header .md-button .md-icon {
	margin-right: 5px;
}
</style>
