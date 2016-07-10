var Class = require('class');

module.exports = Class.extend({
	constructor: function(name)	{
		this.name = name;
	},

	load: function() {
		var data = localStorage[this.name];
		return data ? JSON.parse(data) : [];
	},

	save: function(data) {
		localStorage[this.name] = JSON.stringify(data);
	}
});