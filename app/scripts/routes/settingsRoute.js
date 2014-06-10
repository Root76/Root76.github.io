App.SettingsRoute = Ember.Route.extend({
    model: function() {
        return Ember.Object.create({
            contacts: this.get('store').find('contact'), 
            events: this.get('store').find('event'),
            tasks: this.get('store').find('task'),
            tags: this.get('store').find('tag')
        });
    },
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('contacts').set('model', model.contacts);
        this.controllerFor('events').set('model', model.events);
        this.controllerFor('tasks').set('model', model.tasks);
        this.controllerFor('tags').set('model', model.tags);

        var contacts = this.get('store').find('contact').then(function(data) {
    		controller.set('gatheredContacts', data.get('content'));
    	});
    	var events = this.get('store').find('event').then(function(data) {
    		controller.set('gatheredEvents', data.get('content'));
    	});
    	var tasks = this.get('store').find('task').then(function(data) {
    		controller.set('gatheredTasks', data.get('content'));
    	});
    	var tags = this.get('store').find('tag').then(function(data) {
    		controller.set('gatheredTags', data.get('content'));
    	});

	}
});
