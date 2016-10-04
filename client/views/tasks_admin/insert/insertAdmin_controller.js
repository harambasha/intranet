this.TasksAdminInsertController = RouteController.extend({
    template: "TasksAdminInsert",


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
            Meteor.subscribe("project_list"),
            Meteor.subscribe("tasks_empty"),
            Meteor.subscribe("task_list_admin")
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
            project_list: Project.find({}, {}),
            tasks_empty: Tasks.findOne({_id:null}, {}),
            task_list_admin: Tasks.find({}, {sort:[["taskNumber","desc"]]})
        };




        return data;
    },

    onAfterAction: function() {

    }
});