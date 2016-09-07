var pageSession = new ReactiveDict();

Template.Projects.rendered = function() {
	
};

Template.Projects.events({
	
});

Template.Projects.helpers({
	
});

var ProjectsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ProjectsViewSearchString");
	var sortBy = pageSession.get("ProjectsViewSortBy");
	var sortAscending = pageSession.get("ProjectsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "startDate", "endDate", "note"];
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

var ProjectsViewExport = function(cursor, fileType) {
	var data = ProjectsViewItems(cursor);
	var exportFields = ["name", "startDate", "endDate", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ProjectsView.rendered = function() {
	pageSession.set("ProjectsViewStyle", "table");
	
};

Template.ProjectsView.events({
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
				pageSession.set("ProjectsViewSearchString", searchString);
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
					pageSession.set("ProjectsViewSearchString", searchString);
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
					pageSession.set("ProjectsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("projects.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ProjectsViewExport(this.project_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ProjectsViewExport(this.project_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ProjectsViewExport(this.project_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ProjectsViewExport(this.project_list, "json");
	}

	
});

Template.ProjectsView.helpers({

	"insertButtonClass": function() {
		return Project.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.project_list || this.project_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.project_list && this.project_list.count() > 0;
	},
	"isNotFound": function() {
		return this.project_list && pageSession.get("ProjectsViewSearchString") && ProjectsViewItems(this.project_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ProjectsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ProjectsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ProjectsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ProjectsViewStyle") == "gallery";
	}

	
});


Template.ProjectsViewTable.rendered = function() {
	
};

Template.ProjectsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ProjectsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ProjectsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ProjectsViewSortAscending") || false;
			pageSession.set("ProjectsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ProjectsViewSortAscending", true);
		}
	}
});

Template.ProjectsViewTable.helpers({
	"tableItems": function() {
		return ProjectsViewItems(this.project_list);
	}
});


Template.ProjectsViewTableItems.rendered = function() {
	
};

Template.ProjectsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("projects.details", {projectId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Project.update({ _id: this._id }, { $set: values });

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
						Project.remove({ _id: me._id });
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
		Router.go("projects.edit", {projectId: this._id});
		return false;
	}
});

Template.ProjectsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Project.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Project.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
