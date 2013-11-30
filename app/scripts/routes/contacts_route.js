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

App.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('contact', params.contact_id);
  }
});
