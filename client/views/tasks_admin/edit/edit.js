var pageSession = new ReactiveDict();

Template.TasksAdminEdit.rendered = function() {

};

Template.TasksAdminEdit.events({

});

Template.TasksAdminEdit.helpers({

});

Template.TasksAdminEditEditForm.rendered = function() {


    pageSession.set("tasksEditEditFormInfoMessage", "");
    pageSession.set("tasksEditEditFormErrorMessage", "");

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

Template.TasksAdminEditEditForm.events({
    "submit": function(e, t) {
        e.preventDefault();
        pageSession.set("tasksEditEditFormInfoMessage", "");
        pageSession.set("tasksEditEditFormErrorMessage", "");

        var self = this;

        function submitAction(msg) {
            var tasksEditEditFormMode = "update";
            if(!t.find("#form-cancel-button")) {
                switch(tasksEditEditFormMode) {
                    case "insert": {
                        $(e.target)[0].reset();
                    }; break;

                    case "update": {
                        var message = msg || "Saved.";
                        pageSession.set("tasksEditEditFormInfoMessage", message);
                    }; break;
                }
            }

            Router.go("admin", {});
        }

        function errorAction(msg) {
            msg = msg || "";
            var message = msg.message || msg || "Error.";
            pageSession.set("tasksEditEditFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function(fieldName, fieldValue) {

            },
            function(msg) {

            },
            function(values) {


                Tasks.update({ _id: t.data.task_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
            }
        );

        return false;
    },
    "click #form-cancel-button": function(e, t) {
        e.preventDefault();
        Router.go("admin", {});
    },
    "click #form-close-button": function(e, t) {
        e.preventDefault();

        /*CLOSE_REDIRECT*/
    },
    "click #form-back-button": function(e, t) {
        e.preventDefault();

        /*BACK_REDIRECT*/
    }


});

Template.TasksEditEditForm.helpers({
    "infoMessage": function() {
        return pageSession.get("tasksEditEditFormInfoMessage");
    },
    "errorMessage": function() {
        return pageSession.get("tasksEditEditFormErrorMessage");
    }

});
