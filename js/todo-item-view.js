var StackPanel = require('views/stack-panel');
var Element = require('views/element');

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

module.exports = StackPanel.extend({
	tag: 'li',

	render: function() {
		this.super();
		var toggleCheckbox = new Element({
			tag: 'input',
			class: 'toggle',
			attributes: {type: 'checkbox'}
		}).element;
		this.bind(toggleCheckbox, 'checked', 'completed');
		toggleCheckbox.addEventListener('change', this.onCompletedCheckboxChange.bind(this));
		
		var title = document.createElement('label');
		this.bind(title, 'textContent', 'title');
		title.addEventListener('dblclick', this.onTitleDoubleClick.bind(this));
		
		var destroyButton = new Element({tag: 'button', class: 'destroy'}).element;
		destroyButton.addEventListener('click', this.onDestroyButtonClick.bind(this));
		
		this.titleInput = new Element({tag: 'input', class: 'edit'}).element;
		this.bind(this.titleInput, 'value', 'title');
		this.titleInput.addEventListener('blur', this.onTitleEditorBlur.bind(this));
		this.titleInput.addEventListener('keydown', this.onTitleEditorKeyDown.bind(this));
		
		this.setChildren([
			new StackPanel({
				class: 'view',
				children: [toggleCheckbox, title, destroyButton]
			}),
			this.titleInput
		]);
		this.bind(this, 'completed', 'completed');
		this.bind(this, 'visible', 'visible');
	},

	onCompletedCheckboxChange: function(event) {
		this.data.toggle(event.target.checked);
	},

	onTitleDoubleClick: function() {
		this.toggleEditing(true);
	},

	toggleEditing: function(enabled) {
		this.editing = enabled;
		if (this.editing) {
			this.addClass('editing');
			this.titleInput.focus();
			var length = this.titleInput.value.length;
			this.titleInput.setSelectionRange(length, length);
		} else {
			this.removeClass('editing');
		}
	},

	onDestroyButtonClick: function() {
		this.data.destroy();
	},

	onTitleEditorBlur: function() {
		this.data.setTitle(this.titleInput.value);
		this.toggleEditing(false);
	},
	
	onTitleEditorKeyDown: function(event) {
		if (event.which === ESCAPE_KEY) {
			this.titleInput.value = this.data.title;
			this.toggleEditing(false);
		} else if (event.which === ENTER_KEY) {
			this.data.setTitle(this.titleInput.value);
			this.toggleEditing(false);
		}
	},

	setCompleted: function(completed) {
		this[completed ? 'addClass' : 'removeClass']('completed');
	}
});