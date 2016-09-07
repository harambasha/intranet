var pageSession = new ReactiveDict();

Template.ProjectsDetails.rendered = function() {
	
};

Template.ProjectsDetails.events({
	
});

Template.ProjectsDetails.helpers({
	
});

Template.ProjectsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("projectsDetailsDetailsFormInfoMessage", "");
	pageSession.set("projectsDetailsDetailsFormErrorMessage", "");

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

Template.ProjectsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("projectsDetailsDetailsFormInfoMessage", "");
		pageSession.set("projectsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var projectsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(projectsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("projectsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("projectsDetailsDetailsFormErrorMessage", message);
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

		Router.go("projects", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("projects", {});
	}

	
});

Template.ProjectsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("projectsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("projectsDetailsDetailsFormErrorMessage");
	}
	
});
