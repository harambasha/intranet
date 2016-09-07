Project.allow({
	insert: function (userId, doc) {
		return Project.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Project.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Project.userCanRemove(userId, doc);
	}
});

Project.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Project.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Project.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Project.before.remove(function(userId, doc) {
	
});

Project.after.insert(function(userId, doc) {
	
});

Project.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Project.after.remove(function(userId, doc) {
	
});
