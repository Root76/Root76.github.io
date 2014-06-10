requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

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

});