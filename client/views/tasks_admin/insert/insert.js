var pageSession = new ReactiveDict();

Template.TasksAdminInsert.rendered = function() {

};

Template.TasksAdminInsert.events({

});

Template.TasksAdminInsert.helpers({

});

Template.TasksAdminInsertInsertForm.rendered = function() {


    pageSession.set("tasksAdminInsertInsertFormInfoMessage", "");
    pageSession.set("tasksAdminInsertInsertFormErrorMessage", "");

    $(".input-group.date").each(function() {
        var format = $(this).find("input[type='text']").attr("data-format");

        if(format) {
            format = format.toLowerCase();
        }
        else {
            format = "mm/dd/yyyy";
        }

        $(this).datepicker({
            autoclose: true,
            todayHighlight: true,
            todayBtn: true,
            forceParse: false,
            keyboardNavigation: false,
            format: format
        });
    });

    $("input[type='file']").fileinput();
    $("select[data-role='tagsinput']").tagsinput();
    $(".bootstrap-tagsinput").addClass("form-control");
    $("input[autofocus]").focus();
};

Template.TasksAdminInsertInsertForm.events({
    "submit": function(e, t) {
        e.preventDefault();
        pageSession.set("tasksAdminInsertInsertFormInfoMessage", "");
        pageSession.set("tasksAdminInsertInsertFormErrorMessage", "");

        var self = this;

        function submitAction(msg) {
            var tasksInsertInsertFormMode = "insert";
            if(!t.find("#form-cancel-button")) {
                switch(tasksInsertInsertFormMode) {
                    case "insert": {
                        $(e.target)[0].reset();
                    }; break;

                    case "update": {
                        var message = msg || "Saved.";
                        pageSession.set("tasksAdminInsertInsertFormInfoMessage", message);
                    }; break;
                }
            }

            Router.go("admin.details", {taskId: newId});
        }

        function errorAction(msg) {
            msg = msg || "";
            var message = msg.message || msg || "Error.";
            pageSession.set("tasksAdminInsertInsertFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function(fieldName, fieldValue) {

            },
            function(msg) {

            },
            function(values) {


                newId = Tasks.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
            }
        );

        return false;
    },
    "click #form-cancel-button": function(e, t) {
        e.preventDefault();
    },
    "click #form-close-button": function(e, t) {
        e.preventDefault();
    },
    "click #form-back-button": function(e, t) {
        e.preventDefault();
    }


});

Template.TasksAdminInsertInsertForm.helpers({
    "infoMessage": function() {
        return pageSession.get("tasksAdminInsertInsertFormInfoMessage");
    },
    "errorMessage": function() {
        return pageSession.get("tasksAdminInsertInsertFormErrorMessage");
    },
    'nextTaskNumber': function() { var max = 0; var taskNumbers = Tasks.find({}, { fields: { taskNumber: 1 }}).fetch(); _.each(taskNumbers, function(doc) { var intNum = parseInt(doc.taskNumber); if(!isNaN(intNum) && intNum > max) max = intNum; }); return max + 1; }
});
