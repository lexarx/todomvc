var Observable = require('binding/observable');
var ObservableCollection = require('collections/observable-collection');
var TodoItem = require('./todo-item');
var filters = require('./filters');
var uuid = require('uuid');

module.exports = Observable.extend({
	constructor: function(store) {
		this.super();
		this.store = store;
		this.selectedFilter = filters.ALL;
		var todos = store.load().map(this.createTodoItem, this);
		this.todos = new ObservableCollection(todos);
		this.updateActiveTodoCount();
		this.todos.changed.add(this.onTodosChanged, this);
		this.updateVisibility();
	},

	createTodoItem: function(todo) {
		var todoItem = new TodoItem(todo);
		todoItem.changed.add(this.onTodoItemChanged, this);
		todoItem.destroyed.add(this.onTodoItemDestroyed, this);
		return todoItem;
	},

	addTodo: function(title) {
		var todoItem = this.createTodoItem({
			id: uuid(),
			title: title,
			completed: false
		});
		this.setVisibility(todoItem);
		this.todos.add(todoItem);
	},

	getVisibility: function(todoItem) {
		return this.selectedFilter === filters.ALL ||
			(this.selectedFilter === filters.COMPLETED && todoItem.completed) ||
			(this.selectedFilter === filters.ACTIVE && !todoItem.completed);
	},

	clearCompleted: function() {
		for (var i = this.todos.count() - 1; i >= 0; i--) {
			if (this.todos.get(i).completed) {
				this.todos.removeAt(i);
			}
		}
	},

	save: function() {
		var todos = this.todos.map(function(todoItem) {
			return {
				id: todoItem.id,
				title: todoItem.title,
				completed: todoItem.completed
			};
		});
		this.store.save(todos);
	},

	onTodoItemChanged: function(todoItem, property) {
		if (property === 'title' || property === 'completed') {
			this.save();
			this.updateActiveTodoCount();
		}
	},

	onTodoItemDestroyed: function(todoItem) {
		this.todos.remove(todoItem);
	},

	toggleAll: function(completed) {
		this.todos.each(function(todoItem) {
			todoItem.toggle(completed);
		});
	},

	selectFilter: function(filter) {
		if (this.selectedFilter !== filter) {
			this.selectedFilter = filter;
			this.updateVisibility();
			this.notifyChanged('selectedFilter');
		}
	},

	updateVisibility: function() {
		this.todos.each(function(todoItem) {
			this.setVisibility(todoItem);
		}, this);
	},

	setVisibility: function(todoItem) {
		todoItem.setVisibility(this.getVisibility(todoItem));
	},

	updateActiveTodoCount: function() {
		var activeTodoCount = 0;
		this.todos.each(function(todoItem) {
			if (!todoItem.completed) {
				activeTodoCount++;
			}
		});
		if (this.activeTodoCount !== activeTodoCount) {
			this.activeTodoCount = activeTodoCount;
			this.notifyChanged('activeTodoCount');
		}
	},

	onTodosChanged: function() {
		this.save();
		this.updateActiveTodoCount();
	}
});