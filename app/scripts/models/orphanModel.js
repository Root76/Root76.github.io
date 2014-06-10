requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

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

});