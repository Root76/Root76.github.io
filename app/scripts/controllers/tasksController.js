requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

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

});