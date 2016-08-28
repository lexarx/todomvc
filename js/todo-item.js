var Observable = require('binding/observable');
var Event = require('event');

module.exports = Observable.extend({
	constructor: function(data) {
		this.super(data);
		this.visible = true;
		this.destroyed = new Event();
	},

	destroy: function() {
		this.destroyed.trigger(this);
	}
});