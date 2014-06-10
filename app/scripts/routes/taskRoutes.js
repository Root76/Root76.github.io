App.TasksRoute = Ember.Route.extend({
  	model: function() {
    	return this.get('store').find('task');
  	}
});
App.TasksIndexRoute = Ember.Route.extend({
  	model: function() {
    	return this.modelFor('tasks');
  	}
});
App.TasksTaskRoute = Ember.Route.extend({
  	model: function(params) {
    	return this.get('store').find('task', params.task_id);
  	},
  	setupController: function(controller, model){
  		controller.set('model', model);
  		if (model.reload)
    		model.reload();
  	},
  	actions: {
        toggleCompleted: function(){
        	this.currentModel.set('status', !this.currentModel.get('status'));
        	this.currentModel.save();
        },
        deleteRecord: function() {
        	$("#destroy > script").remove();
        	recID = $("#destroy").html();
			this.get('store').find('task', recID).then(function(rec) {
				rec.deleteRecord();
				rec.save();
			});
        	this.transitionTo('/tasks');
		}
  	}
}, IndividualObjectRoute);