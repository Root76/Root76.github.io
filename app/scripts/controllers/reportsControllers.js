requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

App.ReportsContactsController = Ember.ArrayController.extend({
	needs: ['contacts'],
    contactsController: Ember.computed.alias("controllers.contacts"),
    sortProperties: ['name'],
    sortAscending: true,
	contactsToShow: function() { 
		var sorted = this.get('contactsController').get('contactsToShow');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('contactsController.contactsToShow')
});

App.ReportsEventsController = Ember.ArrayController.extend({
    needs: ['events'],
    eventsController: Ember.computed.alias("controllers.events"),
    sortProperties: ['start_datetime'],
    sortAscending: false,
	eventsToShow: function() { 
		var sorted = this.get('eventsController').get('eventsNoDuplicates');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('eventsController.eventsNoDuplicates')
});

App.ReportsTasksController = Ember.ArrayController.extend({
    needs: ['tasks'],
    tasksController: Ember.computed.alias("controllers.tasks"),
    sortProperties: ['due'],
    sortAscending: false,
	tasksToShow: function() { 
		var sorted = this.get('tasksController').get('tasksToShow');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('tasksController.tasksToShow')
});

App.ReportsTagsController = Ember.ArrayController.extend({
	needs: ['tags'],
    tagsController: Ember.computed.alias("controllers.tags"),
    sortProperties: ['name'],
    sortAscending: true,
	
	tagsToShow: function() { 
		var sorted = this.get('tagsController').get('tagsToShow');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('tagsController.tagsToShow'),	
});

});