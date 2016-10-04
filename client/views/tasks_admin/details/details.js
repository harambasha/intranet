var pageSession = new ReactiveDict();

Template.TasksAdminDetails.rendered = function() {

};

Template.TasksAdminDetails.events({

});

Template.TasksAdminDetails.helpers({

});

Template.TasksAdminDetailsDetailsForm.rendered = function() {


    pageSession.set("tasksAdminDetailsDetailsFormInfoMessage", "");
    pageSession.set("tasksAdminDetailsDetailsFormErrorMessage", "");

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

Template.TasksAdminDetailsDetailsForm.events({
    "submit": function(e, t) {
        e.preventDefault();
        pageSession.set("tasksAdminDetailsDetailsFormInfoMessage", "");
        pageSession.set("tasksAdminDetailsDetailsFormErrorMessage", "");

        var self = this;

        function submitAction(msg) {
            var tasksDetailsDetailsFormMode = "read_only";
            if(!t.find("#form-cancel-button")) {
                switch(tasksDetailsDetailsFormMode) {
                    case "insert": {
                        $(e.target)[0].reset();
                    }; break;

                    case "update": {
                        var message = msg || "Saved.";
                        pageSession.set("tasksAdminDetailsDetailsFormInfoMessage", message);
                    }; break;
                }
            }
        }

        function errorAction(msg) {
            msg = msg || "";
            var message = msg.message || msg || "Error.";
            pageSession.set("tasksAdminDetailsDetailsFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function(fieldName, fieldValue) {

            },
            function(msg) {
            },
            function(values) {
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
        Router.go("admin", {});
    }


});

Template.TasksAdminDetailsDetailsForm.helpers({
    "infoMessage": function() {
        return pageSession.get("tasksAdminDetailsDetailsFormInfoMessage");
    },
    "errorMessage": function() {
        return pageSession.get("tasksAdminDetailsDetailsFormErrorMessage");
    }

});
