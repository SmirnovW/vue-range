var Vue = require('vue'),
	vueRange = require('./vue-range.vue');

new Vue({
	el: '#app',
	data: {
		value: 0
	},
	components: {
		'vue-range': vueRange
	},
	events: {
		'vue-range:value-changed'(value) {
			this.value = value;
		}
	}
})