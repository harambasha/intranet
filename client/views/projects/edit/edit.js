var pageSession = new ReactiveDict();

Template.ProjectsEdit.rendered = function() {
	
};

Template.ProjectsEdit.events({
	
});

Template.ProjectsEdit.helpers({
	
});

Template.ProjectsEditEditForm.rendered = function() {
	

	pageSession.set("projectsEditEditFormInfoMessage", "");
	pageSession.set("projectsEditEditFormErrorMessage", "");

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

Template.ProjectsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("projectsEditEditFormInfoMessage", "");
		pageSession.set("projectsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var projectsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(projectsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("projectsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("projects", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("projectsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Project.update({ _id: t.data.project_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("projects", {});
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

Template.ProjectsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("projectsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("projectsEditEditFormErrorMessage");
	}
	
});
