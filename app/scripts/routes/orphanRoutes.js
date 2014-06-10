requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

App.OrphaneventsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('event');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

App.OrphantasksRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('task');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tasks').set('model', model);
	}
});

App.OrphantagsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('tag');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tags').set('model', model);
	}
});

});