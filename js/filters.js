var ALL = {title: 'All', hash: '#/'};
var ACTIVE = {title: 'Active', hash: '#/active'};
var COMPLETED = {title: 'Completed', hash: '#/completed'};
var filters = [ALL, ACTIVE, COMPLETED];

module.exports = {
	ALL: ALL,
	ACTIVE: ACTIVE,
	COMPLETED: COMPLETED,

	filters: filters,

	getByHash: function(hash) {
		return filters.find(function(filter) {
			return filter.hash === hash;
		});
	}
};