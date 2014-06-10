App.SettingsController = Ember.ObjectController.extend({
    needs: ['contacts', 'events', 'tasks', 'tags'],
    contactsController: Ember.computed.alias("controllers.contacts"),
    eventsController: Ember.computed.alias("controllers.events"),
    tasksController: Ember.computed.alias("controllers.tasks"),
    tagsController: Ember.computed.alias("controllers.tags"),
    contactsCount: function() {
    	return (this.get('gatheredContacts') || []).length;
    }.property('gatheredContacts'),
    eventsCount: function() {
    	return (this.get('gatheredEvents') || []).length;
    }.property('gatheredEvents'),
    tasksCount: function() {
    	return (this.get('gatheredTasks') || []).length;
    }.property('gatheredTasks'),
    tagsCount: function() {
    	return (this.get('gatheredTags') || []).length;
    }.property('gatheredTags')
});