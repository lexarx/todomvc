var Observable = require('binding/observable');
var Event = require('event');

module.exports = Observable.extend({
	constructor: function(data) {
		this.super();
		this.id = data.id;
		this.title = data.title;
		this.completed = data.completed;
		this.visible = true;
		this.destroyed = new Event();
	},

	setTitle: function(title) {
		if (this.title !== title) {
			this.title = title;
			this.notifyChanged('title');
		}
	},

	toggle: function(completed) {
		if (this.completed !== completed) {
			this.completed = completed;
			this.notifyChanged('completed');
		}
	},

	setVisibility: function(visible) {
		if (this.visible !== visible) {
			this.visible = visible;
			this.notifyChanged('visible');
		}
	},

	destroy: function() {
		this.destroyed.trigger(this);
	}
});