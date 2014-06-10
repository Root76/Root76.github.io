App.TagsRoute = Ember.Route.extend({
  	model: function() {
    	return this.get('store').find('tag');
  	}
});
App.TagsIndexRoute = Ember.Route.extend({
  	model: function() {
    	return this.modelFor('tags');
  	}
});
App.TagsTagRoute = Ember.Route.extend({
  	model: function(params) {
    	return this.get('store').find('tag', params.tag_id);
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
			this.get('store').find('tag', recID).then(function(rec) {
				rec.deleteRecord();
				rec.save();
			});
        	this.transitionTo('/tags');
		}
  	}
}, IndividualObjectRoute);