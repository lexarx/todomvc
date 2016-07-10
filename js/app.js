var Store = require('./store');
var TodoModel = require('./todo-model');
var TodoAppView = require('./todo-app-view');
var filters = require('./filters');

var store = new Store('todos-lexarx');
var todoModel = new TodoModel(store);
var todoAppView = new TodoAppView({
	data: todoModel
});

function selectFilter() {
	todoModel.selectFilter(filters.getByHash(window.location.hash) || filters.ALL);
};

selectFilter();
window.addEventListener('hashchange', function() {
	selectFilter();
});

document.body.insertBefore(todoAppView.element, document.body.firstChild);
