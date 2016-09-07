var pageSession = new ReactiveDict();

Template.ProjectsInsert.rendered = function() {
	
};

Template.ProjectsInsert.events({
	
});

Template.ProjectsInsert.helpers({
	
});

Template.ProjectsInsertInsertForm.rendered = function() {
	

	pageSession.set("projectsInsertInsertFormInfoMessage", "");
	pageSession.set("projectsInsertInsertFormErrorMessage", "");

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

Template.ProjectsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("projectsInsertInsertFormInfoMessage", "");
		pageSession.set("projectsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var projectsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(projectsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("projectsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("projects", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("projectsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Project.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ProjectsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("projectsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("projectsInsertInsertFormErrorMessage");
	}
	
});
