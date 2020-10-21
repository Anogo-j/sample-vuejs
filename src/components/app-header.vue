<template>
	<div class="md-elevation-10 header">
		<div>
			Bonjour <span>{{ me.name }}</span>
		</div>
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
