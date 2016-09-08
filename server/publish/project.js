Meteor.publish("project_list", function() {
	return Project.find({});
});

Meteor.publish("projects_empty", function() {
	return Project.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("project_details", function(projectId) {
	return Project.find({_id:projectId}, {});
});

