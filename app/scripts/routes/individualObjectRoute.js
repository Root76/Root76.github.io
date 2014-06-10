IndividualObjectRoute = Ember.Mixin.create({	
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('model', model);
		controller.set('editing', {});
		controller.set('editing.anything', false);
	},
	actions: {
		save: function() {
			if (!this.controller.get('editing.anything'))
				return;
			this.currentModel.save();
			this.controller.set('editing', {});
			this.controller.set('editing.anything', false);
		},
		editField: function(field, iter) {
			this.controller.set('editing.anything', true);
			this.controller.set('editing.' + field, true);
		    Ember.run.schedule('afterRender', this, function() {
				$('#' + field + 'Input' + iter).focus();
		    });
		}
	}
});