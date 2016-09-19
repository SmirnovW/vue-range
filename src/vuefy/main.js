var Vue = require('vue'),
	vueRange = require('./components/vue-range.vue');

new Vue({
	el: '#app',
	data: {
		defaultValue: 50
	},
	components: {
		'vue-range': vueRange
	}
})