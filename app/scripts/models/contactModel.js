requirejs([
  "libs/ember",
  "libs/ember-data"
], function($) {

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

});