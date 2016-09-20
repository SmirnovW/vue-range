/**
 * This is simple alternative of build systems like gulp and grunt.
 * Maybe it look like not pretty but it simple for compile and developing :)
*/
const fs = require("fs"),
	browserify = require('browserify'),
	vueify = require('vueify');

vueify.compiler.applyConfig({
	"presets": ["es2015"],
	"plugins": ["transform-runtime"]
});

var mainFile = './src/vueify/main.js';
var vueRangeFile = './src/vueify/vue-range.vue';

build(mainFile);

fs.watch(mainFile, () => {
	build(mainFile);
});

fs.watch(vueRangeFile, () => {
	build(mainFile);
});

function build(file) {
	browserify(file)
		.transform(vueify)
		.bundle()
		.pipe(fs.createWriteStream("./build/build.js"));
}

