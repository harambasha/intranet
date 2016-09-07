Meteor.publish("task_list", function() {
	return Tasks.publishJoinedCursors(Tasks.find({ownerId:this.userId}, {sort:[["taskNumber","desc"]]}));
});

Meteor.publish("tasks_empty", function() {
	return Tasks.publishJoinedCursors(Tasks.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("task_details", function(taskId) {
	return Tasks.publishJoinedCursors(Tasks.find({_id:taskId,ownerId:this.userId}, {}));
});

