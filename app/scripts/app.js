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
    		this.route("tag", { path: "/:tag_id" });
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
    this.resource("admin");
});

App.ApplicationController = Ember.Controller.extend({
  currentPathDidChange: function() {
  	$("#loader").addClass("showLoader");
    Ember.run.schedule('afterRender', this, function() {
        rebindEvents();
        setTimeout(function(){
	        $("#loader").removeClass("showLoader");
	    }, 400);
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
    "X-AUTHENTICATION-TOKEN": authToken,
    "X-AUTHENTICATION-EMAIL": userEmail
    // authToken,
    // "epDAyxZkc4uLqoyvym_L"
  }
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});

Ember.Inflector.inflector.uncountable('reports_admin');

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
			case "day2": // from beginning to end of next day
				var nextDay2 = moment(now).add('days', 2).hour(0).minute(0).second(0);
				return time >= nextDay2 && time < nextDay2.add('days', 1); 
			case "day3": // from beginning to end of next day
				var nextDay3 = moment(now).add('days', 3).hour(0).minute(0).second(0);
				return time >= nextDay3 && time < nextDay3.add('days', 1); 
			case "day4": // from beginning to end of next day
				var nextDay4 = moment(now).add('days', 4).hour(0).minute(0).second(0);
				return time >= nextDay4 && time < nextDay4.add('days', 1);
			case "day5": // from beginning to end of next day
				var nextDay5 = moment(now).add('days', 5).hour(0).minute(0).second(0);
				return time >= nextDay5 && time < nextDay5.add('days', 1);
			case "day6": // from beginning to end of next day
				var nextDay6 = moment(now).add('days', 6).hour(0).minute(0).second(0);
				return time >= nextDay6 && time < nextDay6.add('days', 1);
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
			case "upcoming": // from beginning of month until now
				return time >= now;
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
	contactsCount: function() {
    	return this.get('length');
    }.property('contacts'),
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
	}.property('showOption', 'sortProperty', 'sortProperties'),
	
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
	eventsCount: function() {
    	return this.get('length');
    }.property('events'),
	showOption: "allOpen",
	showProperty: "updated_at",
	eventsToShow: function(a) { 
		var option = this.get('showOption');
		var sorted;
		switch (option) {
		case "all":
			sorted = this.sortBy(['start_datetime']);
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
	}.property('showOption', 'showProperty', 'sortProperties'),
	eventsNoDuplicates: function() {

		var option = this.get('showOption');
		var sorted;
		switch (option) {
		case "all":
			sorted = this.sortBy(['start_datetime']);
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

		var uniqueEvents = this.getEach('title').uniq();
		console.log(uniqueEvents);
		var eventObject = $.extend({}, uniqueEvents);

		for (var i = 0; i < uniqueEvents.length; i++) {
			var title = eventObject[i];
			var uniqueTitles = sorted.filterProperty('title', title);
			console.log("loop " + i + ". length" + uniqueTitles.length + ". title :" + uniqueEvents[i]);
			if (uniqueTitles[0]['_data']['start_date'] === null) {
				console.log("has a datetime");
				uniqueTitles = Utility.sortByTimeOption(uniqueTitles, 'start_datetime', "upcoming");
				uniqueTitles = uniqueTitles.sortBy(['start_datetime']);
			} else {
				console.log("no datetime, just a date");
				uniqueTitles = Utility.sortByTimeOption(uniqueTitles, 'start_date', "upcoming");
				uniqueTitles = uniqueTitles.sortBy(['start_date']);		
			}
			console.log(uniqueTitles);
			if (uniqueTitles.length > 0) {
				if (uniqueTitles[0].hasOwnProperty('_data')) {
					eventObject[i] = uniqueTitles[0]['_data'];
				} else {
					eventObject[i] = uniqueTitles[0]['id'];
				}
			}
		}

		var array = $.map(eventObject, function(value, index) {
		    return [value];
		});

		console.log(array);

        return array;

	}.property('events', 'showOption', 'showProperty', 'sortProperties'),
	uniqueEventCount: function() {
		var uniqueEvents = this.getEach('title').uniq();
		return uniqueEvents.length;
	}.property('events'),
	eventOrphans: function(a) {

		console.log(this);

		var uniqueEvents = this.getEach('title').uniq();
		console.log("unique events: " + uniqueEvents);
		var eventObject = $.extend({}, uniqueEvents);

		for (var i = 0; i < uniqueEvents.length; i++) {
			var title = eventObject[i];
			var uniqueTitles = this.filterProperty('title', title);
			if (uniqueTitles[0]['_data']['start_date'] === null) {
				uniqueTitles = Utility.sortByTimeOption(uniqueTitles, 'start_datetime', "upcoming");
				uniqueTitles = uniqueTitles.sortBy(['start_datetime']);
			} else {
				uniqueTitles = Utility.sortByTimeOption(uniqueTitles, 'start_date', "upcoming");
				uniqueTitles = uniqueTitles.sortBy(['start_date']);		
			}
			if (uniqueTitles.length > 0) {
				if (uniqueTitles[0].hasOwnProperty('_data')) {
					eventObject[i] = uniqueTitles[0]['_data'];
					console.log("had data");
				} else {
					eventObject[i] = uniqueTitles[0]['id'];
					console.log("no data");
				}
			}
			if (eventObject[i]['is_orphan'] === false) {
				delete eventObject[i];
				console.log("deleting");
			} else {
				console.log("orphan");
			}
		}

		function ObjectLength( object ) {
		    var length = 0;
		    for( var key in object ) {
		        if( object[key].hasOwnProperty('title') ) {
		            length++;
		        }
		    }
		    return length;
		};

		var oLength = ObjectLength(eventObject);

		var array = $.map(eventObject, function(value, index) {
			if (index < oLength) {
		    	return [value];
			}
		});

		console.log(array.length);
		console.log(array);

        return array;

	}.property('events'),
	showOptions: [
		{label: "All", id: "all", showProperty: "updated_at"},
		{label: "Tagged", id: "tagged", showProperty: "updated_at"},
		{label: "New This Week", id: "newThisWeek", showProperty: "updated_at"},
		{label: "New This Month", id: "newThisMonth", showProperty: "updated_at"},
		{label: "Recent", id: "recent", showProperty: "updated_at"}
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
    upcomingToday: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'today');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
    upcomingTomorrow: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'tomorrow');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
    upcomingDay2: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'day2');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
    upcomingDay3: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'day3');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
	upcomingDay4: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'day4');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
	upcomingDay5: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'day5');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
	upcomingDay6: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'day5');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
	upcomingDay7: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'day6');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime'),
    upcomingWeek: function(){
		var sorted = Utility.sortByTimeOption(this, 'start_datetime', 'next7Days');
		sorted = sorted.sortBy('start_datetime');
		return sorted;
	}.property('events', 'model.@each.start_datetime')
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
	tasksCount: function() {
    	return this.get('length');
    }.property('tasks'),
    showOption: "allOpen",
	tasksToShow: function(a) { 
		var option = this.get('showOption');
		var now = moment();
		var sorted = Utility.sortByTimeOption(this, 'due', option);
		sorted = sorted.sortBy(this.get('sortProperties'));
        return sorted;
	}.property('showOption', 'sortProperties', 'model.@each.due'),
	taskOrphans: function(a) {
		var oList = this.store;
		return oList.filter('task', {is_orphan: true}, function(task) {
			return task.get('is_orphan');
		});
	}.property('tasks'),
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
	}.observes('selectedShowOption')
});

App.TagsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true,
	tagsCount: function() {
    	return this.get('length');
    }.property('tags'),
	sortOptions: [
		{label: "Tag Count", primarySort: "count", secondarySort: "name", ascending: false},
		{label: "Name", primarySort: "name", secondarySort: "count", ascending: true}
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
	}.property('showOption', 'sortProperties'),
	tagOrphans: function(a) {
		var oList = this.store;
		return oList.filter('tag', {is_orphan: true}, function(tag) {
			return tag.get('is_orphan');
		});
	}.property('tags'),
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
	}.observes('selectedShowOption')
});

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
    		return getTime(a) - getTime(b);
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

	}.property('eventsController.eventOrphans', 'tasksController.taskOrphans', 'tagsController.tagOrphans')/*,
	orphanTotal: function() {
		var events = this.get('eventsController').get('eventOrphans');
		var tasks = this.get('tasksController').get('taskOrphans');
		var tags = this.get('tagsController').get('tagOrphans');
    	var allItems = [].concat(events, tasks, tags);
    	return allItems;
	}.property('eventsController.eventOrphans', 'tasksController.taskOrphans', 'tagsController.tagOrphans')*/
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
		if (payload.modifiable) {
			delete payload.modifiable;
		}
		if (payload.table) {
			payload.orphans = payload.table;
			delete payload.table;
		}
		var typeKey = type.typeKey;
		if (!typeKey[typeKey.length - 1] !== 's')
			typeKey += 's';
		if (!payload[typeKey]) {
			newPayload = {};
			newPayload[typeKey] = payload;
			return newPayload;
		}
		return payload;
	},
	serialize: function(record, options) {
		var idOnly = function(item) { return item.id; };

		var json = this._super(record, options);
		if (json.contacts) {
			json.contact_ids = json.contacts.map(idOnly);
			delete json.contacts;
		}
		if (json.events) {
			json.event_ids = json.events.map(idOnly);
			delete json.events;
		}
		if (json.tasks) {
			json.task_ids = json.tasks.map(idOnly);
			delete json.tasks;
		}
		if (json.tags) {
			json.tag_ids = json.tags.map(idOnly);
			delete json.tags;
		}
		return json;
	}
});

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    emails: DS.attr('array'),
    organization: DS.attr('string'),
    phones: DS.attr('array'),
    address: DS.attr('string'),
    place: DS.attr('string'),
    notes: DS.attr('string'),
    extended_properties: DS.attr('array'),
    updated_at: DS.attr('date'),
    events: DS.attr('array'),
    tasks: DS.attr('array'),
    tags: DS.attr('array'),
    relatedEmailsLink: function() {
    	var addresses = this.get('emails');
    	console.log(addresses.length);
    	if (addresses.length < 1) {
			return 'https://mail.google.com/mail/u/?authuser=#search/from:+OR+to:'; // filter emails from/to this person
    	} else {
	    	addresses = addresses[0]['email'];
			return 'https://mail.google.com/mail/u/?authuser=' + userEmail + // pick the right user account in case of multiple login
				'#search/from:' + addresses + '+OR+to:' + addresses; // filter emails from/to this person
		}
    }.property('emails'),
    birthdayProperty: function() {
    	var properties = this.get('extended_properties') || [];
    	for (var i = 0; i < properties.length; i++) {
    		if (properties[i].key === "Birthday" || properties[i].key === "birthday")
    			return properties[i];
    	}
    	return null;
    }.property('extended_properties', 'extended_properties.@each.key'),
    birthday: function(key, value) {
    	var birthdayProperty = this.get('birthdayProperty');
	    if (arguments.length > 1) {
			if (!birthdayProperty) { // add new properties row for Birthday
	  			var newProperties = this.get('extended_properties').slice(0) || [];
	  			newProperties.push({key:"Birthday", value:""});
	  			this.set('extended_properties', newProperties); 				
			}
			this.set('birthdayProperty.value', value);
	    }

    	if (birthdayProperty) {
    		return birthdayProperty.value;
    	}
    	return "N/A";
    }.property('extended_properties', 'extended_properties.@each.key', 'extended_properties.@each.value'),
    eventsCount: function() {
    	return this.get('events').length;
    }.property('events'),
    tasksCount: function() {
    	return this.get('tasks').length;
    }.property('tasks'),
    tagsCount: function() {
    	return this.get('tags').length;
    }.property('tags')
});

App.Event = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    location: DS.attr('string'),
    start_datetime: DS.attr('date'),
    end_datetime: DS.attr('date'),
    start_date: DS.attr('date'),
    end_date: DS.attr('date'),
    updated_at: DS.attr('date'),
    is_orphan: DS.attr('boolean'),
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
    startdate_inputformatted: function(key, value) {
	    if (arguments.length > 1) {
	    	var date = moment(value);
	    	if (date.isValid())
	    		this.set('start_date', date.toDate());
	    }
	    var dateString = Utility.convertToHTMLDateTimeLocalInput(this.get('start_date'));
    	return dateString || "N/A";
    }.property('start_date'),
    startdate_displayformatted: function() {
    	return moment(this.get('start_date')).format('MMMM Do, YYYY');
    }.property('start_date'),
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
    enddate_inputformatted: function(key, value) {
	    if (arguments.length > 1) {
	    	var date = moment(value);
	    	if (date.isValid())
	    		this.set('end_date', date.toDate());
	    }
	    var dateString = Utility.convertToHTMLDateTimeLocalInput(this.get('end_date'));
    	return dateString || "N/A";
    }.property('end_date'),
    enddate_displayformatted: function() {
    	return moment(this.get('end_date')).format('MMMM Do, YYYY');
    }.property('end_date'),
    contacts: DS.attr('array'),
    tasks: DS.attr('array'),
    tags: DS.attr('array')
});

App.Task = DS.Model.extend({
    title: DS.attr('string'),
    notes: DS.attr('string'),
    status: DS.attr('boolean'),
    due: DS.attr('date'),
    priority: DS.attr('string'),
    is_orphan: DS.attr('boolean'),
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

App.Orphan = DS.Model.extend({
	eventOrphans: function() {
		return this.get('events');
	},
	taskOrphans: function() {
		return this.get('task');
	},
	tagOrphans: function() {
		return this.get('tag');
	}
});

/*App.Table = DS.Model.extend({
	events: DS.attr('array'),
	tasks: DS.attr('array'),
	tags: DS.attr('array')
});

App.Modifiable = DS.Model.extend({
	title: DS.attr('boolean')
});*/

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
		editField: function(field, iter) {
			this.controller.set('editing.anything', true);
			this.controller.set('editing.' + field, true);
		    Ember.run.schedule('afterRender', this, function() {
				$('#' + field + 'Input' + iter).focus();
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

    	var contacts = this.get('store').find('contact').then(function(data) {
    		controller.set('gatheredContacts', data.get('content'));
    	});
    	var events = this.get('store').find('event').then(function(data) {
    		controller.set('gatheredEvents', data.get('content'));
    	});
    	var tasks = this.get('store').find('task').then(function(data) {
    		controller.set('gatheredTasks', data.get('content'));
    	});
    	var tags = this.get('store').find('tag').then(function(data) {
    		controller.set('gatheredTags', data.get('content'));
    	});
	}
});

App.SettingsRoute = Ember.Route.extend({
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

        var contacts = this.get('store').find('contact').then(function(data) {
    		controller.set('gatheredContacts', data.get('content'));
    	});
    	var events = this.get('store').find('event').then(function(data) {
    		controller.set('gatheredEvents', data.get('content'));
    	});
    	var tasks = this.get('store').find('task').then(function(data) {
    		controller.set('gatheredTasks', data.get('content'));
    	});
    	var tags = this.get('store').find('tag').then(function(data) {
    		controller.set('gatheredTags', data.get('content'));
    	});

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
  		if (model.reload)
    		model.reload();
  	},
  	actions: {
  		deleteRecord: function() {
        	$("#destroy > script").remove();
        	recID = $("#destroy").html();
			this.get('store').find('event', recID).then(function(rec) {
				rec.deleteRecord();
				rec.save();
			});
        	this.transitionTo('/events');
		}
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

App.OrphaneventsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('event');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

App.OrphantasksRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('task');
	},
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('tasks').set('model', model);
	}
});

App.OrphantagsRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('tag');
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

var calPopupTemplate = Handlebars.compile($('#calPopupTemplate').html());
var calPopupTemplate2 = Handlebars.compile($('#calPopupTemplate2').html());
App.CalView = Ember.View.extend({
	didInsertElement: function() {

		var self = this;
		var model = this.get('controller.model');
	    var jsonEvent = model.map(function(record) {
	    	jsonEvent = record.toJSON();
	    	jsonEvent.id = record.id;
            return jsonEvent;
        });

        console.log("events: " + jsonEvent.length);
        console.log(jsonEvent);

        var getTasks = function(cb) {
            var data = 'Input values';
            $.ajax({
                type: 'GET',
                url: 'http://daywon-api-staging.herokuapp.com/tasks',
                contentType: "application/json",
                dataType: "json",
                headers: {
                    "X-AUTHENTICATION-TOKEN": authToken,
                    "X-AUTHENTICATION-EMAIL": userEmail
                },
                success: cb,
                error: function(e) {
                    console.log("couldn't fetch tasks: " + e);
                }
            });
        }

        var callback = function(data) {

        	var allTasks = data.tasks;
        	var jsonTask = [];
        	var j = 0;
        	for (var i = jsonEvent.length; j < allTasks.length; j++) {
        		jsonEvent[i] = allTasks[j];
        		i++;
        	}

        	console.log("with tasks: " + jsonEvent.length);
        	console.log(jsonEvent);

        	var json = jsonEvent;

	        for (var i = 0; i < json.length; i++) {

	        	if (json[i].hasOwnProperty("start_datetime")) {
	        		json[i]["start"] = json[i]["start_datetime"];
	        	} else
	        	if (json[i].hasOwnProperty("start_date")) {
	        		json[i]["start"] = json[i]["start_date"];
	        	} 

	        	if (json[i].hasOwnProperty("end_datetime")) {
	        		json[i]["end"] = json[i]["end_datetime"];
	        	} else
	        	if (json[i].hasOwnProperty("end_date")) {
	        		json[i]["end"] = json[i]["end_date"];
	        	}

	        	if (json[i].hasOwnProperty("due")) {
	        		console.log("there's a due");
	        		json[i]['start'] = json[i]["due"];
	        		json[i]['end'] = json[i]["due"];
	        		json[i]['className'] = 'calTask active';
	        	} else {
	        		json[i]['className'] = 'calEvent active';
	        	}
	        }

	        console.log("INSTANTIATE");
	        startCalendar(jsonEvent, that);

        }

        var that = this;
        getTasks(callback);

        function startCalendar(json, that) {
	        console.log("final json");
	        console.log(json);
	    	that.$().fullCalendar({
		        header: {
		            left: 'prev,next today',
		            center: 'title',
		            right: 'month,agendaWeek,agendaDay,agendaList'
		        },
		        events: json,
		        eventClick: function(calItem, jsEvent, view) {
			        var calElement = this;
			        console.log(calItem);
			        if (calItem.hasOwnProperty('location')) {
						model.store.find('event', calItem.id).then(function(event) { 
							event.reload().then(function(reloadedEvent) { // wait for related tags to be pulled
						        calItem.start_formatted = moment(calItem.start).format('MMMM Do YYYY, h:mm:ss a');
						        calItem.end_formatted = moment(calItem.end).format('MMMM Do YYYY, h:mm:ss a');
						        calItem.tags = reloadedEvent.get('tags');
						        var eventInfo = calPopupTemplate(calItem);

						        new Opentip(calElement, eventInfo, {
				            		style: "calitem",
				            		showOn: "creation",
				            		hideTrigger: "closeButton",
				            		className: "calpop",
				            		background: "#e35d32",
				            		closeButtonRadius: 15,
				            		closeButtonCrossSize: 10,
				            		closeButtonCrossColor: "#ffffff"
				        		});
							});
						});
					} else if (calItem.hasOwnProperty('due')) {
						model.store.find('task', calItem.id).then(function(task) { 
							task.reload().then(function(reloadedTask) { // wait for related tags to be pulled
						        calItem.due_formatted = moment(calItem.due).format('MMMM Do YYYY, h:mm:ss a');
						        calItem.tags = reloadedTask.get('tags');
						        var taskInfo = calPopupTemplate2(calItem);

						        new Opentip(calElement, taskInfo, {
				            		style: "calitem",
				            		showOn: "creation",
				            		hideTrigger: "closeButton",
				            		className: "calpop",
				            		background: "#88c44c",
				            		closeButtonRadius: 15,
				            		closeButtonCrossSize: 10,
				            		closeButtonCrossColor: "#ffffff"
				        		});
							});
						});
					} else {
						alert("something's wrong");
					}
			    }
	   		});
		}
		window.transitionToTag = function(id) {
			document.location.href = document.location.href.split('#')[0] + '#/tags/' + id;
		}
    }
});