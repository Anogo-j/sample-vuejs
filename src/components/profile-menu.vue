
<template>
	<md-menu md-size="auto" md-align-trigger class="profile">
		<md-button md-menu-trigger class="md-icon-button">
			<md-icon>person</md-icon>
			<md-tooltip
				:md-delay="tooltipDelay"
				:md-direction="tooltipDirection"
			>{{ name }}</md-tooltip>
		</md-button>
		<md-menu-content>
			<md-menu-item @click="logout">
				<md-icon>exit_to_app</md-icon>
				<span>déconnexion</span>
			</md-menu-item>
			<slot />
		</md-menu-content>
	</md-menu>
</template>

<script>
export default {
	props: {
		name: { type: String, required: true },
		tooltipDelay: { type: Number, default: 500 },
		tooltipDirection: { type: String, default: "right" },
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
