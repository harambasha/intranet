this.ProjectsEditController = RouteController.extend({
	template: "ProjectsEdit",
	

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
			Meteor.subscribe("project_details", this.params.projectId),
			Meteor.subscribe("task_list")
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
			project_details: Project.findOne({_id:this.params.projectId}, {}),
			task_list: Tasks.find({}, {sort:[["taskNumber","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});