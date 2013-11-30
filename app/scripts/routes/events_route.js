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

App.EventRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('event', params.event_id);
    }
});


