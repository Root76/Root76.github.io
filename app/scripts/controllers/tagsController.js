requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

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

});