this.TasksAdminDetailsController = RouteController.extend({
    template: "TasksAdminDetails",


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
            Meteor.subscribe("task_details", this.params.taskId)
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
            task_details: Tasks.findOne({_id:this.params.taskId}, {})
        };
        return data;
    },

    onAfterAction: function() {

    }
});