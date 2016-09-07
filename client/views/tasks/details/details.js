var pageSession = new ReactiveDict();

Template.TasksDetails.rendered = function() {
	
};

Template.TasksDetails.events({
	
});

Template.TasksDetails.helpers({
	
});

Template.TasksDetailsDetailsForm.rendered = function() {
	

	pageSession.set("tasksDetailsDetailsFormInfoMessage", "");
	pageSession.set("tasksDetailsDetailsFormErrorMessage", "");

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

Template.TasksDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("tasksDetailsDetailsFormInfoMessage", "");
		pageSession.set("tasksDetailsDetailsFormErrorMessage", "");

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
						pageSession.set("tasksDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("tasksDetailsDetailsFormErrorMessage", message);
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

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("tasks", {});
	}

	
});

Template.TasksDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("tasksDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("tasksDetailsDetailsFormErrorMessage");
	}
	
});
