Vue.component('vue-range', Vue.extend({
	props: {
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 100,
		},
		step: {
			type: Number,
			default: 0,
		},
		value: {
			type: Number,
			default: 50,
		}
	},
	data() {
		return {
			positionX: 0,
			prevStep: 0,
			nextStep: 0,
			stepInPixels: 0,
			fillStyleObject: {
				width: '0px'
			},
			sliderStyleObject: {
				left: '0px'
			}
		}
	},
	methods: {
		mouseDownHandler(event) {
			Vue.util.on(window, 'mousemove', this.mouseMoveHandler);
			Vue.util.on(window, 'mouseup', this.removeMouseMoveHandler);
		},

		mouseMoveHandler() {
			var lastPositionX = this.positionX;
			var newPositionX = 0;

			this.positionX = Math.min(
				Math.max(0, (event.pageX - this.$el.offsetLeft)  - (this.$els.slider.offsetWidth / 2)),
				this.$els.rail.offsetWidth - this.$els.slider.offsetWidth
			);

			if (this.step > 0) {
				newPositionX = this._calculatePositionByStep(lastPositionX);
			} else {
				newPositionX = this.positionX;
			}

			if (newPositionX != null) {
				this.sliderStyleObject.left = newPositionX + 'px';
				this.fillStyleObject.width = this.sliderStyleObject.left;
				this.$dispatch('vue-range:value-changed', this._getValueInPercent(newPositionX));
			}
		},

		removeMouseMoveHandler() {
			Vue.util.off(window, 'mousemove', this.mouseMoveHandler);
			Vue.util.off(window, 'mouseup', this.removeMouseMoveHandler);
			this.isActive = false;
		},

		_getValueInPercent(positionX) {
			return Math.round(
				positionX / (this.$els.rail.offsetWidth - this.$els.slider.offsetWidth)
			 * 100);
		},

		_calculatePositionByStep(lastPositionX) {
			if (this.positionX <= Math.floor(this.prevStep) || this.positionX >= Math.ceil(this.nextStep)) {
				if (lastPositionX < this.positionX) {
					this.prevStep = this.nextStep - this.stepInPixels;
					this.nextStep += this.stepInPixels;
					return this.positionX;
				} else if (lastPositionX > this.positionX) {
					this.nextStep = this.prevStep + this.stepInPixels;
					this.prevStep = Math.max(0, this.prevStep - this.stepInPixels);
					return this.positionX;
				}
			}
			return null;
		}
	},
	ready() {

		this.stepInPixels = (this.$els.rail.offsetWidth - this.$els.slider.offsetWidth) / 100 * Math.min(this.step, 100);
		this.nextStep = this.value > 0 ? this.stepInPixels * 2 : this.stepInPixels;

		this.sliderStyleObject.left = (this.$els.rail.offsetWidth - this.$els.slider.offsetWidth) / 100 * Math.min(this.value, 100) + 'px';
		this.fillStyleObject.width = this.sliderStyleObject.left;

	}
}));