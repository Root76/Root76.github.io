requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

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
    recurring: DS.attr('boolean'),
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

});