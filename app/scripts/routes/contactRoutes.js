App.ContactsRoute = Ember.Route.extend({
  	model: function() {
    	return this.get('store').find('contact');
  	}
});
App.ContactsIndexRoute = Ember.Route.extend({
  	model: function() {
    	return this.modelFor('contacts');
  	},
  	afterModel: function(rec){
  		console.log(rec);
  	}
});
App.ContactsContactRoute = Ember.Route.extend({
  	model: function(params) {
   		return this.get('store').find('contact', params.contact_id);
  	},
  	setupController: function(controller, model){
  		controller.set('model', model);
  		if (model.reload)
    		model.reload();
  	},
  	actions: {
  		addProperty: function(){
  			var properties = this.currentModel.get('extended_properties').slice(0) || [];
  			properties.push({key:"", value:""});
  			this.currentModel.set('extended_properties', properties); 
  		},
  		deleteProperty: function(index){
  			var properties = this.currentModel.get('extended_properties').slice(0) || [];
  			if (index < properties.length)
  				properties.splice(index, 1);
  			this.currentModel.set('extended_properties', properties);
  		},
  		deleteRecord: function() {
        	$("#destroy > script").remove();
        	recID = $("#destroy").html();
			this.get('store').find('contact', recID).then(function(rec) {
				rec.deleteRecord();
				rec.save();
			});
		    this.transitionTo('/contacts');
		}
  	}
}, IndividualObjectRoute);