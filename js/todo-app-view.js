var StackPanel = require('views/stack-panel');
var Element = require('views/element');
var Text = require('views/text');
var List = require('views/list');
var TodoItem = require('./todo-item-view');
var filters = require('./filters');

var ENTER_KEY = 13;

module.exports = StackPanel.extend({
	tag: 'section',
	class: 'todoapp',

	render: function() {
		this.super();
		this.newTodoInput = new Element({
			tag: 'input',
			class: 'new-todo',
			attributes: {placeholder: 'What needs to be done?', autofocus: true}
		}).element;
		this.newTodoInput.addEventListener('keydown', this.onNewTodoInputKeyDown.bind(this));

		var toggleAllCheckbox = new Element({
			tag: 'input',
			class: 'toggle-all',
			attributes: {type: 'checkbox'}
		}).element;
		this.bind(toggleAllCheckbox, 'checked', 'activeTodoCount', function(value) {
			return value === 0;
		});
		toggleAllCheckbox.addEventListener('change', this.onToggleAllCheckboxChange.bind(this));

		var todoList = new List({tag: 'ul', class: 'todo-list', view: TodoItem});
		this.bind(todoList, 'items', 'todos');

		var todoCount = new Text({tag: 'span', class: 'todo-count'});
		this.bind(todoCount, 'text', 'activeTodoCount', function(activeTodoCount) {
			return activeTodoCount + ' ' + (activeTodoCount === 1 ? 'item' : 'items') + ' left';
		});

		var filtersContent = [];
		for (var i = 0; i < filters.filters.length; i++) {
			if (i > 0) {
				filtersContent.push(document.createTextNode(' '));
			}
			filtersContent.push(new StackPanel({
				tag: 'li',
				children: [this.createFilterLink(filters.filters[i])]
			}));
		}

		var clearCompletedButton = new Text({
			tag: 'button',
			class: 'clear-completed',
			text: 'Clear completed'
		}).element;
		clearCompletedButton.addEventListener('click', this.onClearCompletedButtonClick.bind(this));

		this.setChildren([
			new StackPanel({
				tag: 'header',
				class: 'header',
				children: [
					new Text({tag: 'h1', text: 'todos'}),
					this.newTodoInput
				]
			}),
			new StackPanel({
				tag: 'section',
				class: 'main',
				children: [
					toggleAllCheckbox,
					todoList
				]
			}),
			new StackPanel({
				tag: 'footer',
				class: 'footer',
				children: [
					todoCount,
					new StackPanel({
						tag: 'ul',
						class: 'filters',
						children: filtersContent
					}),
					clearCompletedButton
				]
			})
		]);
	},

	createFilterLink: function(filter) {
		var link = new Text({
			tag: 'a',
			text: filter.title,
			attributes: {href: filter.hash}
		}).element;
		this.bind(link, 'className', 'selectedFilter', function(selectedFilter) {
			return filter === selectedFilter ? 'selected' : '';
		});
		return link;
	},

	onNewTodoInputKeyDown: function(event) {
		if (event.which === ENTER_KEY) {
			var title = this.newTodoInput.value.trim();
			if (title) {
				this.data.addTodo(title);
				this.newTodoInput.value = '';
			}
		}
	},

	onToggleAllCheckboxChange: function(event) {
		this.data.toggleAll(event.target.checked);
	},

	onClearCompletedButtonClick: function() {
		this.data.clearCompleted();
	}
});