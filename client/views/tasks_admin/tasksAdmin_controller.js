this.TasksAdminController = RouteController.extend({
    template: "TasksAdmin",


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
            Meteor.subscribe("task_list_admin"),
            Meteor.subscribe("option_list"),
            Meteor.subscribe("project_list")
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
            task_list_admin: Tasks.find({}, {sort:[["taskNumber","desc"]]}),
            option_list: Users.find({}, {}),
            project_list: Project.find({}, {})
        };

        return data;
    },

    onAfterAction: function() {

    }
});