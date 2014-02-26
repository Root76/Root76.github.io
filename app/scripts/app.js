var App = window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

/***Router***/
App.Router.map(function () {
    this.resource("reports", function() {
        this.route("events");
        this.route("tasks");
        this.route("contacts");
        this.route("tags");
    });
    this.resource("contacts", function() {
        this.route("contact", { path: "/:contact_id" });    
    });
    this.resource("events", function() {
        this.route("event", { path: "/:event_id" });    
    });
    this.resource("tasks", function() {
        this.route("task", { path: "/:task_id" });
    });
    this.resource("tags", function() {
        this.route("tag", { path: "/:tag_id" });
    });
    this.resource("orphans", function() {
    	this.resource("orphanevents", function() {
    		this.route("event", { path: "/:event_id"});
    	});
    	this.resource("orphantasks", function() {
    		this.route("task", { path: "/:task_id"});
    	});
    	this.resource("orphantags", function() {
    		this.route("tag", { path: "/:tag_id"});
    	});
    });
    this.resource("view");
    this.resource("create", function(){
        this.route("contact");
        this.route("event");
        this.route("task");
        this.route("tag");
    });
    this.resource("calendar");
    this.resource("settings");
});

App.ApplicationController = Ember.Controller.extend({
  currentPathDidChange: function() {
    Ember.run.schedule('afterRender', this, function() {
        rebindEvents();        
    });
  }.observes('currentPath')
});

/***Rest Adapter***/

var authToken;
var userEmail;

function QueryStringToJSON() {            
    var pairs = location.search.slice(1).split('&');
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
}

var query_string = QueryStringToJSON();

authToken = query_string.authentication_token;
userEmail = query_string.user_email;

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: "http://daywon-api-staging.herokuapp.com/",
  headers: {
    "X-AUTHENTICATION-TOKEN": "4N9-_NWfYvYxpesMVpne",
    "X-AUTHENTICATION-EMAIL": "hweaver@evenspring.com"
  }
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});

/*App.ApplicationView = Ember.View.extend({
  actions: {
    anActionName: function(){
        alert("hello world!");
    }
  }
});*/

/*Sorting*/
Utility = {};
Utility.sortByTimeOption = function(enumerable, timePropertyName, timeOption) {
	var now = moment();
	return enumerable.filter(function(item) {		
		var hasDate = item.get('hasDate');
		var time = moment(item.get(timePropertyName));
		
		if (timeOption === "allOpen")
			return true;
		else {			
			switch(timeOption) {
			case "overtime": // earlier than now
				return time <= now; 
			case "todayAndOvertime": // earlier than beginning of next day
				return time < moment(now).add('days', 1).hour(0).minute(0).second(0); 
			case "next7Days": // later than now and earlier than beginning of 8th day
				return time > now && time < moment(now).add('days', 7).hour(0).minute(0).second(0); 
			case "today": // later than now and earlier than beginning of next day
				return time > now && time < moment(now).add('days', 1).hour(0).minute(0).second(0); 
			case "tomorrow": // from beginning to end of next day
				var nextDay = moment(now).add('days', 1).hour(0).minute(0).second(0);
				return time >= nextDay && time < nextDay.add('days', 1); 
			case "thisWeek": // from now until beginning of next Monday
				var nextMonday = moment(now).day(8).hour(0).minute(0).second(0);
				return time > now && time < nextMonday; 
			case "nextWeek": // from beginning of next Monday to beginning of the next Monday
				var nextMonday = moment(now).day(8).hour(0).minute(0).second(0);
				var nextNextMonday = moment(now).day(15).hour(0).minute(0).second(0);
				return time >= nextMonday && time < nextNextMonday; 
			case "newThisWeek": // from beginning of Monday until now
				var monday = moment(now).day(1).hour(0).minute(0).second(0);
				return time >= monday && time < now; 
			case "newThisMonth": // from beginning of month until now
				var beginningOfMonth = moment([now.year(), now.month()])
				return time >= beginningOfMonth && time < now;
			}
		}
		return false;
	});
};
Utility.convertToHTMLDateTimeLocalInput = function(dateString) {
	var date = moment(dateString);
	if (date.isValid())
		return date.format("YYYY-MM-DDTHH:mm"); // HTML type="datetime-local" inputs look for this exact date format
	else return null;
}
Utility.convertToReadableDate = function(dateString) {
	var date = moment(dateString);
	if (date.isValid())
		return date.format("MMMM Do YYYY, h:mm:ss a");
	else return "N/A";
}

App.ContactsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true,
    actions: {
        showAll: function(){
            this.set('sortProperties', ['name']);
            setTimeout(function(){
                $('.sidelist li').css("display", "block");
            }, 100);
        },
        showRecent: function(){
            this.set('sortProperties', ['updated_at']);
            setTimeout(function(){
                var recentItems = $('.sidelist li');
                for (var b = 0; b < recentItems.length; b++) {
                    if (b > 10) {
                        $(recentItems[b]).css("display", "none");
                    }
                }
            }, 100);
        },
        sortName: function (){
            this.set('sortProperties', ['name']);
        },
        sortCompany: function (){
            this.set('sortProperties', ['organization']);
        }
    },
	
	sortOptions: [
		{label: "Name", primarySort: "name", ascending: true},
		{label: "Company", primarySort: "organization", ascending: true},
	],
	selectedSortOption: null,
	selectedSortOptionChanged: function() {
		var sortProperties = [this.selectedSortOption.primarySort];
		if (this.selectedSortOption.secondarySort)
			sortProperties.push(this.selectedSortOption.secondarySort);
		this.set('sortProperties', sortProperties);
		this.set('sortAscending', this.selectedSortOption.ascending);
	}.observes('selectedSortOption'),
    showOption: "allOpen",
	sortProperty: "updated_at",
	contactsToShow: function() { 
		var option = this.get('showOption');
		var sorted;
		switch (option) {
		case "all":
			sorted = this;
			break;
		case "tagged":
			sorted = this.filter(function(item) {		
				//filter out tagged items
				return false;
			});
			break;
		case "recent":
			sorted = this.sortBy(['updated_at']);
			var RECENT_COUNT = 10;
			var currentCount = 0;
			sorted = sorted.filter(function(item) {		
				currentCount++;
				return currentCount <= RECENT_COUNT;
			});
			break;
		default:
			sorted = Utility.sortByTimeOption(this, this.get('sortProperty'), option);
			break;
		}
		sorted = sorted.sortBy(this.get('sortProperties'));
        return sorted;
	}.property('showOption', 'sortProperty', 'model.@each.due', 'sortProperties'),
	
	showOptions: [
		{label: "All", id: "all"},
		{label: "Tagged", id: "tagged"},
		{label: "New This Week", id: "newThisWeek"},
		{label: "New This Month", id: "newThisMonth"},
		{label: "Recent", id: "recent"},
	],
	showOptions2: [
		{label: "Today", id: "today"},
		{label: "Tomorrow", id: "tomorrow"},
		{label: "This Week", id: "thisWeek"},
		{label: "Next Week", id: "nextWeek"},
		{label: "All Open Activities", id: "allOpen"},
	],
	selectedShowOption: null,
	selectedShowOptionChanged: function() {
		if (this.selectedShowOption) {
			this.set('showOption', this.selectedShowOption.id);
			if (this.selectedShowOption.showProperty)
				this.set('showProperty', this.selectedShowOption.showProperty);
		}
		
        setTimeout(function(){
            $(".ui-accordion").accordion("refresh");
        }, 10); // 10ms to let page re-render first, and then refresh accordion to make it sized properly
	}.observes('selectedShowOption')
});

App.EventsController = Ember.ArrayController.extend({
    sortProperties: ['start_datetime', 'end_datetime'],
    sortAscending: false,
	
	showOption: "allOpen",
	showProperty: "updated_at",
	eventsToShow: function(a) { 
		var option = this.get('showOption');
		
		var sorted;
		switch (option) {
		case "all":
			sorted = this;
			break;
		case "tagged":
			sorted = this.filter(function(item) {		
				//filter out tagged items
				return false;
			});
			break;
		case "recent":
			sorted = this.sortBy(['updated_at']);
			var RECENT_COUNT = 10;
			var currentCount = 0;
			sorted = sorted.filter(function(item) {		
				currentCount++;
				return currentCount <= RECENT_COUNT;
			});
			break;
		default:
			sorted = Utility.sortByTimeOption(this, this.get('showProperty'), option);
			break;
		}
		sorted = sorted.sortBy(this.get('sortProperties'));
        return sorted;
	}.property('showOption', 'showProperty', 'model.@each.due', 'sortProperties'),
	
	showOptions: [
		{label: "All", id: "all", showProperty: "updated_at"},
		{label: "Tagged", id: "tagged", showProperty: "updated_at"},
		{label: "New This Week", id: "newThisWeek", showProperty: "updated_at"},
		{label: "New This Month", id: "newThisMonth", showProperty: "updated_at"},
		{label: "Recent", id: "recent", showProperty: "updated_at"},
	],
	showOptions2: [
		{label: "Today", id: "today", showProperty: "start_datetime"},
		{label: "Tomorrow", id: "tomorrow", showProperty: "start_datetime"},
		{label: "This Week", id: "thisWeek", showProperty: "start_datetime"},
		{label: "Next Week", id: "nextWeek", showProperty: "start_datetime"},
		{label: "All Open Activities", id: "allOpen", showProperty: "start_datetime"},
	],
	selectedShowOption: null,
	selectedShowOptionChanged: function() {
		if (this.selectedShowOption) {
			this.set('showOption', this.selectedShowOption.id);
			if (this.selectedShowOption.showProperty)
				this.set('showProperty', this.selectedShowOption.showProperty);
		}
		
        setTimeout(function(){
            $(".ui-accordion").accordion("refresh");
        }, 10); // 10ms to let page re-render first, and then refresh accordion to make it sized properly
	}.observes('selectedShowOption'),
});

App.TasksController = Ember.ArrayController.extend({
    sortProperties: ['due'],
    sortAscending: false,
    actions: {
        sortDate: function (){
            this.set('sortProperties', ['due']);
        },
        sortPriority: function (){
            this.set('sortProperties', ['status']);
        },
        sortName: function (){
            this.set('sortProperties', ['title']);
        },
        sortContact: function (){
            console.log("sort by contact fired");
        }
    },
    
    showOption: "allOpen",
	tasksToShow: function(a) { 
		var option = this.get('showOption');
		var now = moment();
		
		var sorted = Utility.sortByTimeOption(this, 'due', option);
		sorted = sorted.sortBy(this.get('sortProperties'));
        return sorted;
	}.property('showOption', 'model.@each.due', 'sortProperties'),
	
	sortOptions: [
		{label: "Tasks with no dates", primarySort: "noDate", secondarySort: "due", ascending: false},
		{label: "Tasks with dates", primarySort: "hasDate", secondarySort: "due", ascending: false},
		{label: "Priority", primarySort: "status", ascending: false},
		{label: "Alphabetical", primarySort: "title", ascending: true}
	],
	selectedSortOption: null,
	selectedSortOptionChanged: function() {
		var sortProperties = [this.selectedSortOption.primarySort];
		if (this.selectedSortOption.secondarySort)
			sortProperties.push(this.selectedSortOption.secondarySort);
		this.set('sortProperties', sortProperties);
		this.set('sortAscending', this.selectedSortOption.ascending);
	}.observes('selectedSortOption'),
	
	showOptions: [
		{label: "All Open", id: "allOpen"},
		{label: "Overdue", id: "overdue"},
		{label: "Today & Overdue", id: "todayAndOverdue"},
		{label: "Next 7 Days", id: "next7Days"}
	],
	showOptions2: [
		{label: "Today", id: "today"},
		{label: "Tomorrow", id: "tomorrow"},
		{label: "This Week", id: "thisWeek"},
		{label: "Next Week", id: "nextWeek"},
		{label: "All Open Activities", id: "allOpen"},
	],
	selectedShowOption: null,
	selectedShowOptionChanged: function() {
		if (this.selectedShowOption) {
			this.set('showOption', this.selectedShowOption.id);
		}
		
        setTimeout(function(){
            $(".ui-accordion").accordion("refresh");
        }, 10); // 10ms to let page re-render first, and then refresh accordion to make it sized properly
	}.observes('selectedShowOption'),
});

App.TagsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true,
	
	sortOptions: [
		{label: "Tag Count", primarySort: "count", ascending: false},
		{label: "Name", primarySort: "name", ascending: true}
	],
	selectedSortOption: null,
	selectedSortOptionChanged: function() {
		var sortProperties = [this.selectedSortOption.primarySort];
		if (this.selectedSortOption.secondarySort)
			sortProperties.push(this.selectedSortOption.secondarySort);
		this.set('sortProperties', sortProperties);
		this.set('sortAscending', this.selectedSortOption.ascending);
	}.observes('selectedSortOption'),
	
	showOption: "allOpen",
	tagsToShow: function(a) { 
		var option = this.get('showOption');
		
		var sorted = this;
		sorted = sorted.sortBy(this.get('sortProperties'));
        return sorted;
	}.property('showOption', 'model.@each.due', 'sortProperties'),
	
	showOptions: [
		{label: "Today", id: "today", showProperty: "start_datetime"},
		{label: "Tomorrow", id: "tomorrow", showProperty: "start_datetime"},
		{label: "This Week", id: "thisWeek", showProperty: "start_datetime"},
		{label: "Next Week", id: "nextWeek", showProperty: "start_datetime"},
		{label: "All Open Activities", id: "allOpen", showProperty: "start_datetime"},
	],
	selectedShowOption: null,
	selectedShowOptionChanged: function() {
		if (this.selectedShowOption) {
			this.set('showOption', this.selectedShowOption.id);
			if (this.selectedShowOption.showProperty)
				this.set('showProperty', this.selectedShowOption.showProperty);
		}
		
        setTimeout(function(){
            $(".ui-accordion").accordion("refresh");
        }, 10); // 10ms to let page re-render first, and then refresh accordion to make it sized properly
	}.observes('selectedShowOption'),
});

App.IndexController = Ember.ObjectController.extend({
    needs: ['contacts', 'events', 'tasks', 'tags'],
    contactsController: Ember.computed.alias("controllers.contacts"),
    eventsController: Ember.computed.alias("controllers.events"),
    tasksController: Ember.computed.alias("controllers.tasks"),
    tagsController: Ember.computed.alias("controllers.tags")
});

App.ReportsEventsController = Ember.ArrayController.extend({
    needs: ['events'],
    eventsController: Ember.computed.alias("controllers.events"),
    sortProperties: ['start_datetime'],
    sortAscending: false,
	
	eventsToShow: function() { 
		var sorted = this.get('eventsController').get('eventsToShow');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('eventsController.eventsToShow'),	
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
	}.property('tasksController.tasksToShow'),	
});

App.ReportsContactsController = Ember.ArrayController.extend({
	needs: ['contacts'],
    contactsController: Ember.computed.alias("controllers.contacts"),
    sortProperties: ['name'],
    sortAscending: true,
	
	contactsToShow: function() { 
		var sorted = this.get('contactsController').get('contactsToShow');
		rebindEvents(); // by the time the page re-renders, this will run and remake the accordions
        return sorted;
	}.property('contactsController.contactsToShow'),	
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

/***Models***/
App.ArrayTransform = DS.Transform.extend({
  deserialize: function(serialized) {
  	return serialized || [];
  },
  serialize: function(deserialized) {
  	return deserialized || [];
  }
});
App.ApplicationSerializer = DS.RESTSerializer.extend({
  normalizePayload: function(type, payload) {
  	var typeKey = type.typeKey;
  	if (!typeKey[typeKey.length - 1] !== 's')
  		typeKey += 's';
  	if (!payload[typeKey]) {
  		newPayload = {};
  		newPayload[typeKey] = payload;
  		return newPayload;
  	}
    return payload;
  }
});

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    email: DS.attr('string'),
    organization: DS.attr('string'),
    phone: DS.attr('string'),
    address: DS.attr('string'),
    place: DS.attr('string'),
    notes: DS.attr('string'),
    extended_properties: DS.attr('array'),
    updated_at: DS.attr('date'),
    events: DS.attr('array'),
    tasks: DS.attr('array'),
    tags: DS.attr('array')
});

App.Event = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    location: DS.attr('string'),
    start_datetime: DS.attr('date'),
    end_datetime: DS.attr('date'),
    updated_at: DS.attr('date'),
    start_inputformatted: function(key, value) {
	    if (arguments.length > 1) {
	    	var date = moment(value);
	    	if (date.isValid())
	    		this.set('start_datetime', date.toDate());
	    }
	    var dateString = Utility.convertToHTMLDateTimeLocalInput(this.get('start_datetime'));
    	return dateString || "N/A";
    }.property('start_datetime'),
    start_displayformatted: function() {
    	return Utility.convertToReadableDate(this.get('start_datetime')) || "N/A";
    }.property('start_datetime'),

    end_inputformatted: function(key, value) {
	    if (arguments.length > 1) {
	    	var date = moment(value);
	    	if (date.isValid())
	    		this.set('end_datetime', date.toDate());
	    }
	    var dateString = Utility.convertToHTMLDateTimeLocalInput(this.get('end_datetime'));
    	return dateString || "N/A";
    }.property('end_datetime'),
    end_displayformatted: function() {
    	return Utility.convertToReadableDate(this.get('end_datetime')) || "N/A";
    }.property('end_datetime'),
    contacts: DS.attr('array'),
    tasks: DS.attr('array'),
    tags: DS.attr('array')
});

App.Task = DS.Model.extend({
    title: DS.attr('string'),
    notes: DS.attr('string'),
    status: DS.attr('boolean'),
    due: DS.attr('date'),
	noDate: function() { 
	   return this.get('due') === undefined || this.get('due') === null;
	}.property('due'),
	hasDate: function() { 
	   return this.get('due') !== undefined && this.get('due') !== null;
	}.property('due'),

    due_inputformatted: function(key, value) {
	    if (arguments.length > 1) {
	    	var date = moment(value);
	    	if (date.isValid())
	    		this.set('due', date.toDate());
	    }
	    var dateString = Utility.convertToHTMLDateTimeLocalInput(this.get('due'));
    	return dateString || "N/A";
    }.property('due'),
    due_displayformatted: function() {
    	return Utility.convertToReadableDate(this.get('due')) || "N/A";
    }.property('due'),
    contacts: DS.attr('array'),
    events: DS.attr('array'),
    tags: DS.attr('array')
});

App.Tag = DS.Model.extend({
    name: DS.attr('string'),
	count: function() { // eventually has to count up all the associations
		return 0;
	}.property(),
    contacts: DS.attr('array'),
    events: DS.attr('array'),
    tasks: DS.attr('array')
});

/*App.RelatedContact = DS.Model.extend({
	name: DS.attr('string')
});

App.RelatedEvent = DS.Model.extend({
	title: DS.attr('string'),
	contact: DS.belongsTo('contact'),
	task: DS.belongsTo('task'),
	tag: DS.belongsTo('tag')
});

App.RelatedTask = DS.Model.extend({
	title: DS.attr('string'),
	contact: DS.belongsTo('contact')
});

App.RelatedTag = DS.Model.extend({
	name: DS.attr('string'),
	contact: DS.belongsTo('contact')
});*/

App.Orphan = DS.Model.extend({
	title: DS.attr('string')
});

App.Table = DS.Model.extend({
	title: DS.attr('string')
});

App.Modifiable = DS.Model.extend({
	title: DS.attr('boolean')
});

/*Routes*/

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
		editField: function(field) {
			this.controller.set('editing.anything', true);
			this.controller.set('editing.' + field, true);

		    Ember.run.schedule('afterRender', this, function() {
				$('#' + field + 'Input').focus();
		    });
		}
	}
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return Ember.Object.create({
            contacts: this.get('store').find('contact'), 
            events: this.get('store').find('event'),
            tasks: this.get('store').find('task'),
            tags: this.get('store').find('tag')
        });
    },
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('contacts').set('model', model.contacts);
        this.controllerFor('events').set('model', model.events);
        this.controllerFor('tasks').set('model', model.tasks);
        this.controllerFor('tags').set('model', model.tags);
	}
});

App.ReportsEventsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('event');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

App.ReportsTasksRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('task');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tasks').set('model', model);
	}
});

App.ReportsContactsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('contact');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('contacts').set('model', model);
	}
});

App.ReportsTagsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('tag');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tags').set('model', model);
	}
});

/*Tasks*/

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
    	model.reload();
  	},
  	actions: {
        toggleCompleted: function(){
        	this.currentModel.set('status', !this.currentModel.get('status'));
        	this.currentModel.save();
        }
  	}
}, IndividualObjectRoute);

/*Events*/

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
    	model.reload();
  	}
}, IndividualObjectRoute);

/*Contacts*/

App.ContactsRoute = Ember.Route.extend({
  	model: function() {
    	return this.get('store').find('contact');
  	}
});
App.ContactsIndexRoute = Ember.Route.extend({
  	model: function() {
    	return this.modelFor('contacts');
  	}
});
App.ContactsContactRoute = Ember.Route.extend({
  	model: function(params) {
   		return this.get('store').find('contact', params.contact_id).then(function(){
   			rebindEvents();
   		});
  	},
  	setupController: function(controller, model){
  		controller.set('model', model);
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
  		}
  	}
}, IndividualObjectRoute);

/*Tags*/

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
    	model.reload();
  	}
}, IndividualObjectRoute);

/*App.OrphansIndexRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('orphan');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});*/

App.OrphaneventsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('orphan');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

App.OrphantasksRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('orphan');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tasks').set('model', model);
	}
});

App.OrphantagsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('orphan');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tags').set('model', model);
	}
});

/*Calendar*/

App.CalendarRoute = Ember.Route.extend({
    model: function() {
        return this.get('store').find('event');
    },
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

App.CalView = Ember.View.extend({
	didInsertElement: function() {
	    var json = this.get('controller.model').map(function(record) {
            return record.toJSON();
        });
        for (var i = 0; i < json.length; i++) {
        	if (json[i].hasOwnProperty("start_datetime")) {
        		json[i]["start"] = json[i]["start_datetime"];
        	}
        	if (json[i].hasOwnProperty("end_datetime")) {
        		json[i]["end"] = json[i]["end_datetime"];
        	}
        }
    	this.$().fullCalendar({
	        header: {
	            left: 'prev,next today',
	            center: 'title',
	            right: 'month,agendaWeek,agendaDay'
	        },
	        events: json,
	        eventClick: function(calEvent, jsEvent, view) {

		        //console.log('Event: ' + calEvent.title);
		        //console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
		        //console.log('View: ' + view.name);

		        var calDate = calEvent.start;
		        calDate = moment(calDate).format('MM/DD/YYYY');

		        var calStart = calEvent.start;
		        calStart = moment(calStart).format('MMMM Do YYYY, h:mm:ss a');

		        var calEnd = calEvent.end;
		        calEnd = moment(calEnd).format('MMMM Do YYYY, h:mm:ss a');

		        var eventInfo = '<h2>' + calEvent.title + '</h2><h3>' + calDate + '</h3><div class="calPopupTags"><ul><li><img src="img/tags.png"><span>Lunch</span></li><li><img src="img/tags.png"><span>Party</span></li></ul></div><div class="calPopupCont"><p><b>Event description:</b> ' + calEvent.description + '</p><p><b>Event start:</b> ' + calStart + '</p><p><b>Event end:</b> ' + calEnd + '</div>';

		        new Opentip(this, eventInfo, {
            		style: "calitem",
            		showOn: "creation",
            		hideTrigger: "closeButton",
            		className: "calevent",
            		background: "#88c44c",
            		closeButtonRadius: 15,
            		closeButtonCrossSize: 10,
            		closeButtonCrossColor: "#ffffff"
        		});
		    }
   		});
    }
});