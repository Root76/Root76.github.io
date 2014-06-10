App.ReportsContactsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('contact');
  },
  setupController: function(controller, model) {
    controller.set('model', model);
        this.controllerFor('contacts').set('model', model);
  }
});

App.ReportsEventsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('event');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

App.ReportsTasksRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('task');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tasks').set('model', model);
	}
});

App.ReportsTagsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('tag');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tags').set('model', model);
	}
});