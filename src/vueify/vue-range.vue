<style>
	.vue-range {
		width: 100%;
		height: 100%;
		position: relative;
		user-drag: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	.vue-range__rail {
		width: 100%;
		height: 2px;
		display: flex;
		position: relative;
		background: #cccccc;
	}
	.vue-range__fill {
		height: 100%;
		background: #00e500;
		position: absolute;

	}
	.vue-range__slider {
		width: 12px;
		height: 12px;
		align-self: center;
		position: relative;
		background: #f5f5f5;
		border-radius: 50%;
		border: 1px solid #cccccc;
		user-drag: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
</style>

<template>
	<div class="vue-range">
		<div class="vue-range__rail" v-el:rail @click="clickOnRail">
			<div class="vue-range__fill" v-bind:style="fillStyleObject"></div>
			<div class="vue-range__slider" v-el:slider v-bind:style="sliderStyleObject" @mousedown="mouseDownHandler"></div>
		</div>
	</div>
</template>

<script>
export default {
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
		clickOnRail(event) {
			this.positionX = this._getPositionX(event.pageX);
			var newPositionX = this.stepInPixels * Math.ceil(this.positionX / this.stepInPixels);
			this.prevStep = newPositionX - this.stepInPixels;
			this.nextStep = newPositionX + this.stepInPixels;
			
			this._setPositionX(newPositionX);
		},
		mouseDownHandler(event) {
			window.addEventListener('mousemove', this.mouseMoveHandler);
			window.addEventListener('mouseup', this.removeMouseMoveHandler);
		},

		mouseMoveHandler() {
			var lastPositionX = this.positionX;
			var newPositionX = 0;

			this.positionX = this._getPositionX(event.pageX);

			if (this.step > 0) {
				newPositionX = this._calculatePositionByStep(lastPositionX);
			} else {
				newPositionX = this.positionX;
			}

			if (newPositionX != null) {
				this._setPositionX(newPositionX);
			}
		},

		removeMouseMoveHandler() {
			window.removeEventListener('mousemove', this.mouseMoveHandler);
			window.removeEventListener('mouseup', this.removeMouseMoveHandler);
			this.isActive = false;
		},

		_getPositionX(pageX) {
			return Math.min(
				Math.max(0, (pageX - this.$el.offsetLeft)  - (this.$els.slider.offsetWidth / 2)),
				this.$els.rail.offsetWidth - this.$els.slider.offsetWidth
			);
		},

		_setPositionX(x) {
			this.sliderStyleObject.left = x + 'px';
			this.fillStyleObject.width = this.sliderStyleObject.left;
			this.$dispatch('vue-range:value-changed', this._getValueInPercent(x));
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
}
</script>