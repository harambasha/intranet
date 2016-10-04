var pageSession = new ReactiveDict();

var modifyQueryIfArray = function (key, sessionKey) {
    var value = pageSession.get(sessionKey);
    var query = pageSession.get('Query');
    if (value) {
        var isDate = false;
        if (sessionKey === 'StartDate') {
            query[key] ? query[key].$gte = value : query[key] = {$gte: value};
            isDate = true;
        }
        if (sessionKey === 'EndDate') {
            query[key] ? query[key].$lte = value : query[key] = {$lte: value};
            isDate = true;
        }
        if (!isDate) {
            query[key] = {$eq: value};
        }
    }
    pageSession.set("Query", query);
};

Template.TasksAdmin.rendered = function () {
    pageSession.set("DeveloperId", "");
    pageSession.set("ProjectId", "");
    pageSession.set("StartDate", "");
    pageSession.set("EndDate", "");
    pageSession.set('Query', {});
};

Template.TasksAdmin.events({});

Template.TasksAdmin.helpers({});

var TasksViewAdminItems = function (cursor) {
    if (!cursor) {
        return [];
    }

    var searchString = pageSession.get("TasksViewSearchString");
    var sortBy = pageSession.get("TasksViewSortBy");
    var sortAscending = pageSession.get("TasksViewSortAscending");
    if (typeof(sortAscending) == "undefined") sortAscending = true;

    var raw = cursor.fetch();

    // filter
    var filtered = [];
    if (!searchString || searchString == "") {
        filtered = raw;
    } else {
        searchString = searchString.replace(".", "\\.");
        var regEx = new RegExp(searchString, "i");
        var searchFields = ["taskNumber", "date", "projectId", "project.name", "totalHours", "description", "user.profile.name"];
        filtered = _.filter(raw, function (item) {
            var match = false;
            _.each(searchFields, function (field) {
                var value = (getPropertyValue(field, item) || "") + "";

                match = match || (value && value.match(regEx));
                if (match) {
                    return false;
                }
            })
            return match;
        });
    }

    // sort
    if (sortBy) {
        filtered = _.sortBy(filtered, sortBy);

        // descending?
        if (!sortAscending) {
            filtered = filtered.reverse();
        }
    }

    return filtered;
};

var TasksViewExport = function (cursor, fileType) {
    var data = TasksViewAdminItems(cursor);
    var exportFields = ["taskNumber", "date", "project.name", "totalHours", "description", "user.profile.name"];

    var str = convertArrayOfObjects(data, exportFields, fileType);

    var filename = "export." + fileType;

    downloadLocalResource(str, filename, "application/octet-stream");
};

Template.TasksAdminView.rendered = function () {
    pageSession.set("TasksViewStyle", "table");

};

Template.TasksAdminView.events({
    "submit #dataview-controls": function (e, t) {
        return false;
    },

    "click #dataview-search-button": function (e, t) {
        e.preventDefault();
        var form = $(e.currentTarget).parent();
        if (form) {
            var searchInput = form.find("#dataview-search-input");
            if (searchInput) {
                searchInput.focus();
                var searchString = searchInput.val();
                pageSession.set("TasksViewSearchString", searchString);
            }

        }
        return false;
    },


    "change #userSelect": function (e, t) {
        e.preventDefault();
        var newValue = $(e.target).val();
        pageSession.set("DeveloperId", newValue);
        if (newValue) {
            modifyQueryIfArray('ownerId', 'DeveloperId');
        }
        else {
            var query = pageSession.get('Query');
            delete query['ownerId'];
            pageSession.set('Query', query);
            modifyQueryIfArray('ownerId', 'DeveloperId');
        }
    },

    "change #projectSelect": function (e, t) {
        var selectedValue = $(e.target).val();
        pageSession.set("ProjectId", selectedValue);
        if (selectedValue) {
            modifyQueryIfArray('projectId', 'ProjectId');
        }
        else {
            var query = pageSession.get('Query');
            delete query['projectId'];
            pageSession.set('Query', query);
            modifyQueryIfArray('projectId', 'ProjectId');
        }
    },

    "change #startDatePicker": function (e, t) {
        var dateValue = $(e.target).datepicker({}).val();
        if (dateValue) {
            var date = new Date(dateValue);
            date.setHours(0, 0, 0, 0);
            pageSession.set("StartDate", date);
            modifyQueryIfArray('createdAt', 'StartDate');
        }
    },

    "change #endDatePicker": function (e, t) {
        var endDateValue = $(e.target).datepicker({}).val();
        if (endDateValue) {
            var dateEnd = new Date(endDateValue);
            dateEnd.setHours(23, 59, 59, 0);
            pageSession.set("EndDate", dateEnd);
            modifyQueryIfArray('createdAt', 'EndDate');
        }
    },

    "keydown #dataview-search-input": function (e, t) {
        if (e.which === 13) {
            e.preventDefault();
            var form = $(e.currentTarget).parent();
            if (form) {
                var searchInput = form.find("#dataview-search-input");
                if (searchInput) {
                    var searchString = searchInput.val();
                    pageSession.set("TasksViewSearchString", searchString);
                }

            }
            return false;
        }

        if (e.which === 27) {
            e.preventDefault();
            var form = $(e.currentTarget).parent();
            if (form) {
                var searchInput = form.find("#dataview-search-input");
                if (searchInput) {
                    searchInput.val("");
                    pageSession.set("TasksViewSearchString", "");
                }
            }
            return false;
        }

        return true;
    },

    "click #dataview-insert-button": function (e, t) {
        e.preventDefault();
        Router.go("tasks.insert", {});
    },

    "click #dataview-export-default": function (e, t) {
        e.preventDefault();
        TasksViewExport(this.task_list_admin, "csv");
    },

    "click #dataview-export-csv": function (e, t) {
        e.preventDefault();
        TasksViewExport(this.task_list_admin, "csv");
    },

    "click #dataview-export-tsv": function (e, t) {
        e.preventDefault();
        TasksViewExport(this.task_list_admin, "tsv");
    },

    "click #dataview-export-json": function (e, t) {
        e.preventDefault();
        TasksViewExport(this.task_list_admin, "json");
    }

});


Template.TasksAdminView.helpers({
    "insertButtonClass": function () {
        return Tasks.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
    },

    "isEmpty": function () {
        return !this.task_list_admin || this.task_list_admin.count() == 0;
    },

    "isNotEmpty": function () {
        return this.task_list_admin && this.task_list_admin.count() > 0;
    },
    "isNotFound": function () {
        console.log("Hello");
        return this.task_list_admin && pageSession.get("TasksViewSearchString") && TasksViewAdminItems(this.task_list_admin).length == 0;
    },
    "searchString": function () {
        return pageSession.get("TasksViewSearchString");
    },
    "viewAsTable": function () {
        return pageSession.get("TasksViewStyle") == "table";
    },
    "viewAsList": function () {
        return pageSession.get("TasksViewStyle") == "list";
    },
    "viewAsGallery": function () {
        return pageSession.get("TasksViewStyle") == "gallery";
    }
});


Template.TasksAdminViewTable.rendered = function () {
};

Template.TasksAdminViewTable.events({
    "click .th-sortable": function (e, t) {
        e.preventDefault();
        var oldSortBy = pageSession.get("TasksViewSortBy");
        var newSortBy = $(e.target).attr("data-sort");
        pageSession.set("TasksViewSortBy", newSortBy);
        if (oldSortBy == newSortBy) {
            var sortAscending = pageSession.get("TasksViewSortAscending") || false;
            pageSession.set("TasksViewSortAscending", !sortAscending);
        } else {
            pageSession.set("TasksViewSortAscending", true);
        }
    }
});

Template.TasksAdminViewTable.helpers({
    "tableItems": function () {
        this.task_list_admin = Tasks.find(pageSession.get('Query'));
        console.log(this.task_list_admin.count());
        return TasksViewAdminItems(this.task_list_admin);
    }
});

Template.TasksAdminViewTableItems.rendered = function () {

};

Template.TasksAdminViewTableItems.events({
    "click td": function (e, t) {
        e.preventDefault();

        Router.go("admin.details", {taskId: this._id});
        return false;
    },

    "click .inline-checkbox": function (e, t) {
        e.preventDefault();

        if (!this || !this._id) return false;

        var fieldName = $(e.currentTarget).attr("data-field");
        if (!fieldName) return false;
        var values = {};
        values[fieldName] = !this[fieldName];
        Tasks.update({_id: this._id}, {$set: values});
        return false;
    },

    "click #delete-admin-button": function (e, t) {
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
                    callback: function () {
                        Tasks.remove({_id: me._id});
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
    "click #edit-admin-button": function (e, t) {
        e.preventDefault();
        Router.go("admin.edit", {taskId: this._id});
        return false;
    }
});

Template.TasksAdminViewTableItems.helpers({
    "checked": function (value) {
        return value ? "checked" : ""
    },
    "editAdminButtonClass": function () {
        return Tasks.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
    },

    "deleteAdminButtonClass": function () {
        return Tasks.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
    }
});
