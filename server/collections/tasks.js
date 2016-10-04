Tasks.allow({
	insert: function (userId, doc) {
		return Tasks.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Tasks.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Tasks.userCanRemove(userId, doc);
	}
});

Tasks.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Tasks.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Tasks.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

Tasks.before.remove(function(userId, doc) {
	
});

Tasks.after.insert(function(userId, doc) {
	
});

Tasks.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Tasks.after.remove(function(userId, doc) {
	
});
