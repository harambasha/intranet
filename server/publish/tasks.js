Meteor.publish("task_list", function() {
	return Tasks.publishJoinedCursors(Tasks.find({}, {sort:[["taskNumber","desc"]]}));
});

Meteor.publish("tasks_empty", function() {
	return Tasks.publishJoinedCursors(Tasks.find({_id:null}, {}));
});

Meteor.publish("task_details", function(taskId) {
	return Tasks.publishJoinedCursors(Tasks.find({_id:taskId}, {}));
});

