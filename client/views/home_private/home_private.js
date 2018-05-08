var pageSession = new ReactiveDict();

Template.HomePrivate.rendered = function() {

};

Template.HomePrivate.events({

});

Template.HomePrivate.helpers({
	'userIsKemal': function () {
		if (Meteor.user().profile.email === 'kemal@pajevic.dk') {
			return true;
		} else {
			return false;
		}
	},
});

var TasksViewKemalItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("TasksViewKemalSearchString");
	var sortBy = pageSession.get("TasksViewKemalSortBy");
	var sortAscending = pageSession.get("TasksViewKemalSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["taskNumber", "date", "projectId", "project.name", "totalHours", "description"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var TasksViewKemalExport = function(cursor, fileType) {
	var data = TasksViewKemalItems(cursor);
	var exportFields = ["taskNumber", "date", "project.name", "totalHours", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.TasksViewKemal.rendered = function() {
	pageSession.set("TasksViewKemalStyle", "table");

};

Template.TasksViewKemal.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("TasksViewKemalSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("TasksViewKemalSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("TasksViewKemalSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("tasks.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		TasksViewKemalExport(this.task_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		TasksViewKemalExport(this.task_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		TasksViewKemalExport(this.task_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		TasksViewKemalExport(this.task_list, "json");
	}


});

Template.TasksViewKemal.helpers({

	"insertButtonClass": function() {
		return Tasks.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.task_list || this.task_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.task_list && this.task_list.count() > 0;
	},
	"isNotFound": function() {
		return this.task_list && pageSession.get("TasksViewKemalSearchString") && TasksViewKemalItems(this.task_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("TasksViewKemalSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("TasksViewKemalStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("TasksViewKemalStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("TasksViewKemalStyle") == "gallery";
	}


});


Template.TasksViewKemalTable.rendered = function() {

};

Template.TasksViewKemalTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("TasksViewKemalSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("TasksViewKemalSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("TasksViewKemalSortAscending") || false;
			pageSession.set("TasksViewKemalSortAscending", !sortAscending);
		} else {
			pageSession.set("TasksViewKemalSortAscending", true);
		}
	}
});

Template.TasksViewKemalTable.helpers({
	"tableItems": function() {
		return TasksViewKemalItems(this.task_list);
	}
});


Template.TasksViewKemalTableItems.rendered = function() {

};

Template.TasksViewKemalTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();

		Router.go("tasks.details", {taskId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Tasks.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Tasks.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("tasks.edit", {taskId: this._id});
		return false;
	}
});

Template.TasksViewKemalTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return Tasks.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Tasks.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
