var pageSession = new ReactiveDict();

Template.TasksInsert.rendered = function() {
	
};

Template.TasksInsert.events({
	
});

Template.TasksInsert.helpers({
	
});

Template.TasksInsertInsertForm.rendered = function() {
	

	pageSession.set("tasksInsertInsertFormInfoMessage", "");
	pageSession.set("tasksInsertInsertFormErrorMessage", "");

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

Template.TasksInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("tasksInsertInsertFormInfoMessage", "");
		pageSession.set("tasksInsertInsertFormErrorMessage", "");

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
						pageSession.set("tasksInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("tasks.details", {taskId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("tasksInsertInsertFormErrorMessage", message);
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

		

		Router.go("tasks", {});
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

Template.TasksInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("tasksInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("tasksInsertInsertFormErrorMessage");
	}, 
	'nextTaskNumber': function() { var max = 0; var taskNumbers = Tasks.find({}, { fields: { taskNumber: 1 }}).fetch(); _.each(taskNumbers, function(doc) { var intNum = parseInt(doc.taskNumber); if(!isNaN(intNum) && intNum > max) max = intNum; }); return max + 1; }
});
