App.Router.map(function () {
    this.resource("dashboard");
    this.resource("contacts", function() {
        this.resource("contact", { path: "/:contact_id"});    
    });
    this.resource("events", function() {
        this.resource("event", { path: "/:event_id"});    
    });
    this.resource("tasks", function() {
        this.resource("task", { path: "/:task_id"});    
    });
    this.resource("tags", function() {
        this.resource("tag", { path: "/:tag_id"});    
    });
    this.resource("orphans", function() {
        this.resource("orphan", { path: "/:orphan_id"});    
    });
    this.resource("calendar");
    this.resource("settings");
});

App.ContactsRoute = Ember.Route.extend({
    model: function() {
        return Ember.$.getJSON('http://staging-krqwhjugxs.elasticbeanstalk.com/contacts');
    }
});

var posts = [{
    id: '1',
    title: 'Green Eggs and Ham',
    author: {
        name: 'Dr. Suess',
        dob: '1940'
    },
    gender: 'Male'
}, {
    id: '2',
    title: 'Heart of Darkness',
    author: {
        name: 'Joseph Conrad',
        dob: '1930'
    },
    gender: 'Male'
}];

/* Google Analytics Path Watching... */
/*
App.ApplicationController = Em.Controller.extend

    routeChanged: (->
        return unless window.ga
        Em.run.next ->
            ga('send', 'pageview', {
                'page': window.location.hash,
                'title': window.location.hash
                });
    ).observes('currentPath')
*/