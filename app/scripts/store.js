App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: 'http://localhost:3000'
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});