this.Project = new Mongo.Collection("project");

this.Project.userCanInsert = function(userId, doc) {
	return true;
};

this.Project.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Project.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
