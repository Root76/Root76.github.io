requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

App.Tag = DS.Model.extend({
    name: DS.attr('string'),
    contacts: DS.attr('array'),
    events: DS.attr('array'),
    tasks: DS.attr('array'),
	count: DS.attr('string'),
    is_orphan: DS.attr('boolean'),
    contactsCount: function() {
    	return this.get('contacts').length;
    }.property('contacts'),
    eventsCount: function() {
    	return this.get('events').length;
    }.property('events'),
    tasksCount: function() {
    	return this.get('tasks').length;
    }.property('tasks')
});

});