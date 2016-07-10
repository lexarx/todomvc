module.exports = {
	entry: __dirname + '/js/app',
	module_directories: [
		'node_modules',
		'js'
	],
	output: {
		path: __dirname + '/dist',
		publicPath: '/dist',
		filename: 'app.js'
	}
};