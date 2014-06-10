App.OrphansIndexController = Ember.ArrayController.extend({
    needs: ['events', 'tasks', 'tags'],
    eventsController: Ember.computed.alias("controllers.events"),
    tasksController: Ember.computed.alias("controllers.tasks"),
    tagsController: Ember.computed.alias("controllers.tags"),
	oEvents: function() { 
		var sorted = this.get('eventsController').get('eventOrphans');
        return sorted;
	}.property('eventsController.eventOrphans'),
	oTasks: function() { 
		var sorted = this.get('tasksController').get('taskOrphans');
        return sorted;
	}.property('tasksController.taskOrphans'),
	oTags: function() { 
		var sorted = this.get('tagsController').get('tagOrphans');
        return sorted;
	}.property('tagsController.tagOrphans'),
	totalOrphans: function() {
		var events = this.get('eventsController').get('eventOrphans');
		var tasks = this.get('tasksController').get('taskOrphans');
		var tags = this.get('tagsController').get('tagOrphans');
    	var allItems = [].concat(events, tasks, tags);
    	console.log(allItems);
    	return allItems;
	}.property('eventsController.eventOrphans', 'tasksController.taskOrphans', 'tagsController.tagOrphans')
});

App.OrphaneventsController = Ember.ArrayController.extend({
    needs: ['events'],
    eventsController: Ember.computed.alias("controllers.events"),
    sortProperties: ['start_datetime'],
    sortAscending: false,
	oEvents: function() { 
		var sorted = this.get('eventsController').get('eventOrphans');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('eventsController.eventOrphans')
});

App.OrphantasksController = Ember.ArrayController.extend({
    needs: ['tasks'],
    tasksController: Ember.computed.alias("controllers.tasks"),
    sortProperties: ['due'],
    sortAscending: false,
	oTasks: function() { 
		var sorted = this.get('tasksController').get('taskOrphans');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('tasksController.taskOrphans')
});

App.OrphantagsController = Ember.ArrayController.extend({
	needs: ['tags'],
    tagsController: Ember.computed.alias("controllers.tags"),
    sortProperties: ['name'],
    sortAscending: true,
	oTags: function() { 
		var sorted = this.get('tagsController').get('tagOrphans');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('tagsController.tagOrphans')
});