var pageSession = new ReactiveDict();

Template.Tasks.rendered = function() {
	if (Meteor.user().profile.email === 'kemal@pajevic.dk') {
		Router.go('home_private');
	}
};

Template.Tasks.events({

});

Template.Tasks.helpers({

});

var TasksViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("TasksViewSearchString");
	var sortBy = pageSession.get("TasksViewSortBy");
	var sortAscending = pageSession.get("TasksViewSortAscending");
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

var TasksViewExport = function(cursor, fileType) {
	var data = TasksViewItems(cursor);
	var exportFields = ["taskNumber", "date", "project.name", "totalHours", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.TasksView.rendered = function() {
	pageSession.set("TasksViewStyle", "table");

};

Template.TasksView.events({
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
				pageSession.set("TasksViewSearchString", searchString);
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
					pageSession.set("TasksViewSearchString", searchString);
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
					pageSession.set("TasksViewSearchString", "");
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
		TasksViewExport(this.task_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		TasksViewExport(this.task_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		TasksViewExport(this.task_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		TasksViewExport(this.task_list, "json");
	}


});

Template.TasksView.helpers({

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
		return this.task_list && pageSession.get("TasksViewSearchString") && TasksViewItems(this.task_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("TasksViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("TasksViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("TasksViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("TasksViewStyle") == "gallery";
	}


});


Template.TasksViewTable.rendered = function() {

};

Template.TasksViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("TasksViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("TasksViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("TasksViewSortAscending") || false;
			pageSession.set("TasksViewSortAscending", !sortAscending);
		} else {
			pageSession.set("TasksViewSortAscending", true);
		}
	}
});

Template.TasksViewTable.helpers({
	"tableItems": function() {
		return TasksViewItems(this.task_list);
	}
});


Template.TasksViewTableItems.rendered = function() {

};

Template.TasksViewTableItems.events({
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

Template.TasksViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" },
	"editButtonClass": function() {
		return Tasks.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Tasks.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
