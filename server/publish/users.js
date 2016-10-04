Meteor.publish("option_list", function () {
    return Users.find({});
});