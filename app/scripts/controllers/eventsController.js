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
		console.log("unique events");

		var eventObject = $.extend({}, uniqueEvents);
		console.log(eventObject);
		for (var i = 0; i < uniqueEvents.length; i++) {
			var title = eventObject[i];
			console.log('title: ' + title);
			var uniqueTitles = sorted.filterProperty('title', title);
			//console.log("loop " + i + ". length" + uniqueTitles.length + ". title :" + uniqueEvents[i]);
			console.log('unique');
			console.log(uniqueTitles);
			console.log(uniqueTitles.length);
			if (uniqueTitles.length > 1) {
				if (uniqueTitles[0]['_data']['start_date'] === null) {
					//console.log("has a datetime");
					uniqueTitles = Utility.sortByTimeOption(uniqueTitles, 'start_datetime', "upcoming");
					uniqueTitles = uniqueTitles.sortBy(['start_datetime']);
				} else {
					//console.log("no datetime, just a date");
					uniqueTitles = Utility.sortByTimeOption(uniqueTitles, 'start_date', "upcoming");
					uniqueTitles = uniqueTitles.sortBy(['start_date']);		
				}
			}
			console.log('unique title');
			console.log(uniqueTitles);

			if (uniqueTitles.length > 0) {
				if (uniqueTitles[0].hasOwnProperty('_data')) {
					eventObject[i] = uniqueTitles[0]['_data'];
					/*if (uniqueTitles.length > 1) {
						//console.log("there's another one");
						if (uniqueTitles[1]['_data']['start_date'] === null) {
							//console.log('appending full datetime');
							eventObject[i]['nextDate'] = uniqueTitles[1]['_data']['start_datetime'];
						} else {
							//console.log('appending just a date, aint nobody got time for that');
							eventObject[i]['nextDate'] = uniqueTitles[1]['_data']['start_date'];						
						}
					}*/
				} else {
					eventObject[i] = uniqueTitles[0]['id'];
				}
			} else {
				eventObject[i] = uniqueTitles;
			}
			console.log(eventObject[i]);
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