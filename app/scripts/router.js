App.Router.map(function () {
    this.resource("contacts", function() {
        this.resource("contact", { path: "/:contact_id"});    
    });
    this.resource("events", function() {
        this.resource("event", { path: "/:event_id"});    
    });
    this.resource("tasks", function() {
        this.resource("task", { path: "/:task_id"});    
    });
});
