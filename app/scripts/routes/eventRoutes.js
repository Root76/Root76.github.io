requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

App.EventsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('event');
    }
});
App.EventsIndexRoute = App.EventsRoute.extend({
    model: function () {
        return this.modelFor('events');
    }
});
App.EventsEventRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('event', params.event_id);
    },
  	setupController: function(controller, model){
  		controller.set('model', model);
  		if (model.reload)
    		model.reload();
  	},
  	actions: {
  		deleteRecord: function() {
        	$("#destroy > script").remove();
        	recID = $("#destroy").html();
			this.get('store').find('event', recID).then(function(rec) {
				rec.deleteRecord();
				rec.save();
			});
        	this.transitionTo('/events');
		}
  	}
}, IndividualObjectRoute);

});