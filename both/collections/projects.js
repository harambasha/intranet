this.Projects = new Mongo.Collection("projects");

this.Projects.userCanInsert = function(userId, doc) {
	return true;
};

this.Projects.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Projects.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
