this.HomePrivateController = RouteController.extend({
	template: "HomePrivate",


	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [
			Meteor.subscribe("project_list"),
			Meteor.subscribe("task_list_fc")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		var data = {
			params: this.params || {},
			task_list: Tasks.find({ "projectId": "QYSXcgoksaqhPdP6G" }, {sort:[["taskNumber","desc"]]})
		};
		return data;
	},

	onAfterAction: function() {

	}
});
