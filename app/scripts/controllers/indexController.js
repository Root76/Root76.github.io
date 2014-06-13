requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

App.IndexController = Ember.ObjectController.extend({
    needs: ['contacts', 'events', 'tasks', 'tags'],
    contactsController: Ember.computed.alias("controllers.contacts"),
    eventsController: Ember.computed.alias("controllers.events"),
    tasksController: Ember.computed.alias("controllers.tasks"),
    tagsController: Ember.computed.alias("controllers.tags"),
    recent10Items: function() {
    	var contacts = this.get('gatheredContacts') || [];
    	var events = this.get('gatheredEvents') || [];
    	var tasks = this.get('gatheredTasks') || [];
    	var tags = this.get('gatheredTags') || [];
    	contacts.map(function(item) { item.set('isContact', true); });
    	events.map(function(item) { item.set('isEvent', true); });
    	tasks.map(function(item) { item.set('isTask', true); });
    	tags.map(function(item) { item.set('isTag', true); });

    	var allItems = [].concat(contacts, events, tasks, tags);
    	var getTime = function(item) {
    		var time = moment(item.get('updated_at') || item.get('created_at'));
    		return (time.isValid()) ? time.unix() : 0;
    	};
    	allItems.sort(function(a, b) {
    		return getTime(b) - getTime(a);
    	});
    	return allItems.slice(0, 10);
    }.property('gatheredContacts', 'gatheredEvents', 'gatheredTasks', 'gatheredTags'),
    upcomingToday: function() {
    	var todayEvents = this.get('store').find('event');
        console.log(todayEvents);
    	var getTime = function(item) {
    		var time = moment(item.get('start_datetime'));
    		return (time.isValid()) ? time.unix() : 0;
    	};
    	/*arr.sort(function(a, b) {
    		return getTime(a) - getTime(b);
    	});*/
       	return todayEvents;
    }.property('events')
});

});