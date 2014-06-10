requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {


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

});